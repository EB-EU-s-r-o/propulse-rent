/**
 * Bitrix24 API Client for ROOF21 Dashboard
 * All requests are routed through the authenticated `bitrix-proxy` edge function.
 * The Bitrix webhook URL is a server-side secret and is NEVER exposed to the browser.
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class BitrixClient {
    constructor() {
        this.cache = new Map();
        this.pendingRequests = new Map();
    }

    /**
     * Calls the secured server-side proxy. Requires an authenticated session.
     */
    async _fetch(method, params = {}, retryCount = 0) {
        try {
            const { data, error } = await supabase.functions.invoke('bitrix-proxy', {
                body: { endpoint: method, ...params },
            });

            if (error) throw new Error('Request failed');
            if (data?.error) throw new Error('Request failed');

            return data?.result;
        } catch (error) {
            logger.error(`Failed to call ${method}:`, error);

            if (retryCount < 2) {
                await new Promise(r => setTimeout(r, 1000 * (retryCount + 1)));
                return this._fetch(method, params, retryCount + 1);
            }

            throw new Error('Unable to reach the CRM service.');
        }
    }

    async getProperties(forceRefresh = false) {
        const cacheKey = 'properties';
        if (!forceRefresh && this._isCached(cacheKey)) {
            return this.cache.get(cacheKey).data;
        }

        try {
            const entityTypeId = 1030;
            const result = await this._fetch('crm.item.list', {
                entityTypeId,
                select: ['id', 'title', 'uf_*'],
            });

            if (!result) return [];

            const properties = result.items.map(this._mapBitrixToProperty);
            this._setCache(cacheKey, properties);
            return properties;
        } catch (error) {
            logger.error('Error fetching properties:', error);
            return [];
        }
    }

    async getUnits(propertyId, forceRefresh = false) {
        const cacheKey = `units_${propertyId}`;
        if (!forceRefresh && this._isCached(cacheKey)) {
            return this.cache.get(cacheKey).data;
        }

        try {
            const entityTypeId = 1032;
            const result = await this._fetch('crm.item.list', {
                entityTypeId,
                filter: { parentId2: propertyId },
            });

            if (!result) return [];

            const units = result.items.map(this._mapBitrixToUnit);
            this._setCache(cacheKey, units);
            return units;
        } catch (error) {
            logger.error('Error fetching units:', error);
            return [];
        }
    }

    async getLeads() {
        try {
            const result = await this._fetch('crm.lead.list', {
                select: ['ID', 'TITLE', 'STATUS_ID', 'OPPORTUNITY', 'CURRENCY_ID', 'ASSIGNED_BY_ID', 'COMPANY_TITLE', 'NAME', 'LAST_NAME'],
            });

            if (!result) return [];

            return result.map(lead => ({
                id: lead.ID,
                name: `${lead.NAME || ''} ${lead.LAST_NAME || ''}`.trim() || lead.TITLE,
                company: lead.COMPANY_TITLE || 'Unknown',
                value: parseFloat(lead.OPPORTUNITY) || 0,
                owner: lead.ASSIGNED_BY_ID,
                stageId: lead.STATUS_ID,
                email: '',
            }));
        } catch (error) {
            logger.error('Error fetching leads:', error);
            return [];
        }
    }

    async updateLead(leadId, fields) {
        try {
            await this._fetch('crm.lead.update', { id: leadId, fields });
            return true;
        } catch (error) {
            logger.error('Error updating lead:', error);
            return false;
        }
    }

    async createDeal(leadId) {
        logger.debug('Creating deal from lead:', leadId);
    }

    async postUpdate(property) {
        try {
            const fields = this._mapPropertyToBitrix(property);
            await this._fetch('crm.item.update', {
                entityTypeId: 1030,
                id: property.id,
                fields,
            });
            return true;
        } catch (error) {
            logger.error('Error updating property:', error);
            return false;
        }
    }

    webhookHandler(event) {
        const { event: eventName } = event || {};
        if (eventName === 'ONCRMITEMUPDATE') {
            this.cache.clear();
        }
    }

    // ==========================================
    // Mappers & Helpers
    // ==========================================

    _mapBitrixToProperty(item) {
        return { id: item.id, title: item.title };
    }

    _mapBitrixToUnit(item) {
        return { id: item.id, title: item.title };
    }

    _mapPropertyToBitrix(property) {
        return { title: property.title };
    }

    _isCached(key) {
        if (!this.cache.has(key)) return false;
        const { timestamp } = this.cache.get(key);
        return Date.now() - timestamp < CACHE_DURATION;
    }

    _setCache(key, data) {
        this.cache.set(key, { data, timestamp: Date.now() });
    }
}

export const bitrixClient = new BitrixClient();
