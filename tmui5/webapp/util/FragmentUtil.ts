import Control from "sap/ui/core/Control";

/**
 * Utility class to manage fragments for reuse .
 * Handles loading, caching, and destroying fragments to avoid duplicate IDs and optimize performance.
 */
export default class FragmentUtil {
  /**
   * Loads a fragment asynchronously and caches it in the controller.
   * This ensures fragments are only created once and reused thereafter.
   *
   * @param oController - The controller instance requesting the fragment
   * @param sFragmentName - Name of the fragment to be loaded
   * @param sFragmentKey - A unique key to store and retrieve the fragment in the cache
   * @returns A promise that resolves to the loaded fragment
   */
  public static async loadValueHelpFragment(
    oController: any,
    sFragmentName: string,
    sFragmentKey: string
  ): Promise<Control> {
    if (!oController._fragments) {
      oController._fragments = {};
    }

    if (!oController._fragments[sFragmentKey]) {
      oController._fragments[sFragmentKey] = oController.loadFragment({
        name: sFragmentName,
      });
    }

    return await oController._fragments[sFragmentKey];
  }

  /**
   * Destroys a previously loaded fragment and removes it from the cache.
   * Ensures proper cleanup of fragment resources to prevent duplicate ID problems.
   *
   * @param oController - The controller instance requesting the destruction
   * @param sFragmentKey - The unique key of the fragment to be destroyed
   */
  public static destroyFragment(oController: any, sFragmentKey: string): void {
    if (oController._fragments && oController._fragments[sFragmentKey]) {
      oController._fragments[sFragmentKey]
        .then((oFragment: { destroy: () => void }) => {
          oFragment.destroy();
        })
        .catch((error: any) => {
          console.error("Error destroying fragment:", error);
        });

      delete oController._fragments[sFragmentKey];
    }
  }
}
