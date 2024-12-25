sap.ui.define(["sap/ui/core/Fragment"], function (Fragment) {
  "use strict";

  return {
    /**
     * Loads a fragment asynchronously and caches it in the controller.
     * This Ensures fragments are only created once and reused thereafter.
     *
     * @param {sap.ui.core.mvc.Controller} oController - The controller instance requesting the fragment
     * @param {string} sFragmentName - Name of the fragment to be loaded
     * @param {string} sFragmentKey - A unique key to store and retrieve the fragment in the cache
     * @returns {Promise<sap.ui.core.Control>} A promise that resolves to the loaded fragment
     */
    async loadValueHelpFragment(oController, sFragmentName, sFragmentKey) {
      // Initialize the fragment cache in the controller if not already present
      if (!oController._fragments) {
        oController._fragments = {};
      }

      /*
        oController._fragments = {
            ..
            AssignedToValueHelp: Promise {...}, -> loadFragment() resolves to the fragment instance
            CustomerValueHelp: Promise {...},
            ..
            };

        // Access a specific fragment
        const assignedToFragment = oController._fragments["AssignedToValueHelp"];
      */

      // Check if the fragment is already loaded and cached
      if (!oController._fragments[sFragmentKey]) {
        oController._fragments[sFragmentKey] = oController.loadFragment({
          name: sFragmentName,
        });
      }

      // wait for the fragment to be loaded and return it
      const oFragment = await oController._fragments[sFragmentKey];
      return oFragment;
    },

    /**
     * Destroys a previously loaded fragment and removes it from the cache.
     * Ensures proper cleanup of fragment resources to prevent duplicate ID problems.
     *
     * @param {sap.ui.core.mvc.Controller} oController - The controller instance requesting the destruction
     * @param {string} sFragmentKey - The unique key of the fragment to be destroyed
     */
    destroyFragment(oController, sFragmentKey) {
      if (oController._fragments && oController._fragments[sFragmentKey]) {
        oController._fragments[sFragmentKey]
          // Resolve the Promise and Destroy the Fragment Instance
          .then((oFragment) => {
            oFragment.destroy();
          })
          .catch((error) => {
            console.error("Error destroying fragment:", error);
          });

        // Remove from cache
        delete oController._fragments[sFragmentKey];
      }
    },
  };
});
