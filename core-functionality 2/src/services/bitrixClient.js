/**
 * Bitrix24 API Client for ROOF21 Dashboard
 * Handles communication with Bitrix24 REST API and Webhooks
 */

const BITRIX_WEBHOOK_URL = import.meta.env.VITE_BITRIX_WEBHOOK_URL || ''; // Should be defined in .env
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class BitrixClient {
    constructor() {
        this.cache = new Map();
        this.pendingRequests = new Map();
    }

    /**
     * Generic fetch wrapper with error handling and retries
     */
    async _fetch(method, params = {}, retryCount = 0) {
        // Use local proxy to avoid CORS and hide credentials
        const url = `/api/bitrix-proxy?endpoint=${method}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            if (!response.ok) {
                throw new Error(`Bitrix API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(`Bitrix API Error: ${data.error_description || data.error}`);
            }

            return data.result;

        } catch (error) {
            console.error(`Failed to call ${method}:`, error);

            if (retryCount < 3) {
                console.log(`Retrying ${method}... (${retryCount + 1}/3)`);
                await new Promise(r => setTimeout(r, 1000 * (retryCount + 1)));
                return this._fetch(method, params, retryCount + 1);
            }

            throw error;
        }
    }

    /**
     * Get Properties (Developments) from Bitrix
     * Maps Bitrix SPA/List items to Dashboard Property model
     */
    async getProperties(forceRefresh = false) {
        const cacheKey = 'properties';
        if (!forceRefresh && this._isCached(cacheKey)) {
            return this.cache.get(cacheKey).data;
        }

        try {
            // Example method: crm.item.list for a specific SPA (Smart Process Automation)
            const entityTypeId = import.meta.env.VITE_BITRIX_ENTITY_TYPE_ID_PROPERTY || 1030;
            const result = await this._fetch('crm.item.list', {
                entityTypeId: entityTypeId,
                select: ['id', 'title', 'uf_*'], // Select all user fields
            });

            if (!result) return []; // Fallback for no config

            const properties = result.items.map(this._mapBitrixToProperty);
            this._setCache(cacheKey, properties);
            return properties;
        } catch (error) {
            console.error('Error fetching properties:', error);
            return [];
        }
    }

    /**
     * Get Units for a specific Property
     */
    async getUnits(propertyId, forceRefresh = false) {
        const cacheKey = `units_${propertyId}`;
        if (!forceRefresh && this._isCached(cacheKey)) {
            return this.cache.get(cacheKey).data;
        }

        try {
            // Example: Filter units by parent property ID
            const entityTypeId = import.meta.env.VITE_BITRIX_ENTITY_TYPE_ID_UNIT || 1032;
            const result = await this._fetch('crm.item.list', {
                entityTypeId: entityTypeId,
                filter: { 'parentId2': propertyId }, // TODO: Check actual parent field name
            });

            if (!result) return [];

            const units = result.items.map(this._mapBitrixToUnit);
            this._setCache(cacheKey, units);
            return units;
        } catch (error) {
            console.error(`Error fetching units for property ${propertyId}:`, error);
            return [];
        }
    }

    /**
     * Get Leads for Pipeline
     */
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
                owner: lead.ASSIGNED_BY_ID, // Needs user mapping
                stageId: lead.STATUS_ID,
                email: '', // Requires separate fetch or 'EMAIL' in select if available
            }));
        } catch (error) {
            console.error('Error fetching leads:', error);
            return [];
        }
    }

    /**
     * Update Lead Stage
     */
    async updateLead(leadId, fields) {
        try {
            await this._fetch('crm.lead.update', {
                id: leadId,
                fields: fields
            });
            return true;
        } catch (error) {
            console.error(`Error updating lead ${leadId}:`, error);
            return false;
        }
    }

    /**
     * Create Deal from Lead
     */
    async createDeal(leadId) {
        // Logic to convert lead to deal
        // Usually involves getting lead data and calling crm.deal.add
        console.log('Creating deal from lead:', leadId);
        // Implementation depends on specific business logic
    }

    /**
     * Send Property Update back to Bitrix
     */
    async postUpdate(property) {
        try {
            const fields = this._mapPropertyToBitrix(property);
            await this._fetch('crm.item.update', {
                entityTypeId: 1030,
                id: property.id,
                fields: fields
            });
            return true;
        } catch (error) {
            console.error(`Error updating property ${property.id}:`, error);
            return false;
        }
    }

    /**
     * Handle Incoming Webhook Event
     */
    webhookHandler(event) {
        console.log('Received Webhook Event:', event);
        // In a real app, this would likely trigger a re-fetch or state update
        // depending on the event type (ONCRMITEMUPDATE, ONCRMLEADUPDATE, etc.)

        const { event: eventName, data } = event;

        if (eventName === 'ONCRMITEMUPDATE') {
            // Invalidate cache for properties or units
            this.cache.clear();
        }
    }

    // ==========================================
    // Mappers & Helpers
    // ==========================================

    _mapBitrixToProperty(item) {
        // TODO: Map actual Bitrix fields to Dashboard fields
        return {
            id: item.id,
            title: item.title,
            // ... map other fields
        };
    }

    _mapBitrixToUnit(item) {
        return {
            id: item.id,
            title: item.title,
            // ... map other fields
        };
    }

    _mapPropertyToBitrix(property) {
        return {
            title: property.title,
            // ... reverse mapping
        };
    }

    _isCached(key) {
        if (!this.cache.has(key)) return false;
        const { timestamp } = this.cache.get(key);
        return Date.now() - timestamp < CACHE_DURATION;
    }

    _setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
}

export const bitrixClient = new BitrixClient();
