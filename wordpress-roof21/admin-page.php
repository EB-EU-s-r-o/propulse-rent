<?php
/*
 * Roof21 Dashboard Sync - Admin Settings Page
 * Handles menu registration, settings registration, and UI rendering.
 */

// 1. Register the Menu Item
function roof21_add_admin_menu() {
    add_options_page(
        'Roof21 Sync Settings', // Page Title
        'Roof21 Sync',          // Menu Title
        'manage_options',       // Capability
        'roof21-sync',          // Menu Slug
        'roof21_render_admin_page' // Callback function
    );
}
add_action('admin_menu', 'roof21_add_admin_menu');

// 2. Register Settings (allow WordPress to save them)
function roof21_settings_init() {
    register_setting('roof21_sync_group', 'roof21_api_key');
    register_setting('roof21_sync_group', 'roof21_sync_interval');
    register_setting('roof21_sync_group', 'roof21_delete_missing');
}
add_action('admin_init', 'roof21_settings_init');

// 3. Render the Admin Page UI
function roof21_render_admin_page() {
    // Check user capabilities
    if (!current_user_can('manage_options')) {
        return;
    }
    ?>
    <div class="wrap">
        <h1 class="wp-heading-inline">Roof21 Dashboard Sync Settings</h1>
        <hr class="wp-header-end">

        <!-- Status Card -->
        <div class="card" style="max-width: 800px; padding: 20px; margin-top: 20px; border-left: 4px solid #2271b1;">
            <h2 class="title">Sync Status</h2>
            <p><strong>Endpoint:</strong> <code><?php echo get_site_url(); ?>/wp-json/roof21/v1/sync</code></p>
            <p><strong>Last Run:</strong> <?php echo esc_html(get_option('roof21_last_sync', 'Never')); ?></p>
        </div>

        <!-- Settings Form -->
        <form method="post" action="options.php">
            <?php settings_fields('roof21_sync_group'); ?>
            <?php do_settings_sections('roof21_sync_group'); ?>
            
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="roof21_api_key">Secret API Key</label></th>
                    <td>
                        <input name="roof21_api_key" type="password" id="roof21_api_key" value="<?php echo esc_attr(get_option('roof21_api_key')); ?>" class="regular-text code" />
                        <p class="description">Must match the key in your RENT Dashboard settings.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="roof21_sync_interval">Sync Interval</label></th>
                    <td>
                        <select name="roof21_sync_interval" id="roof21_sync_interval">
                            <option value="hourly" <?php selected(get_option('roof21_sync_interval'), 'hourly'); ?>>Hourly</option>
                            <option value="daily" <?php selected(get_option('roof21_sync_interval'), 'daily'); ?>>Daily</option>
                            <option value="manual" <?php selected(get_option('roof21_sync_interval'), 'manual'); ?>>Manual Only</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Cleanup Strategy</th>
                    <td>
                        <fieldset>
                            <label for="roof21_delete_missing">
                                <input name="roof21_delete_missing" type="checkbox" id="roof21_delete_missing" value="1" <?php checked(get_option('roof21_delete_missing'), 1); ?> />
                                Delete properties locally if they are removed from the source Dashboard?
                            </label>
                        </fieldset>
                    </td>
                </tr>
            </table>

            <?php submit_button(); ?>
        </form>

        <!-- Manual Actions -->
        <h2 style="margin-top: 40px;">Manual Actions</h2>
        <p>Force a synchronization immediately. Useful for debugging.</p>
        <button id="roof21-run-sync" class="button button-secondary button-large">
            <span class="dashicons dashicons-update" style="margin-top:4px;"></span> Run Sync Now
        </button>

        <script>
        jQuery(document).ready(function($) {
            $('#roof21-run-sync').on('click', function(e) {
                e.preventDefault();
                alert('This button would trigger the AJAX sync in the full plugin version.');
            });
        });
        </script>
    </div>
    <?php
}
?>
