var util = {
    removeCache:function (moduleName) {
        // Run over the cache looking for the files
        // loaded by the specified module name
        this.searchCache(moduleName, function (mod) {
            delete require.cache[mod.id];
        });
    },

    searchCache:function (moduleName, callback) {
        // Resolve the module identified by the specified name
        var mod = require.resolve(moduleName);

        // Check if the module has been resolved and found within
        // the cache
        if (mod && ((mod = require.cache[mod]) !== undefined)) {
            // Recursively go over the results
            (function run(mod) {
                // Go over each of the module's children and
                // run over it
                mod.children.forEach(function (child) {
                    run(child);
                });

                // Call the specified callback providing the
                // found module
                callback(mod);
            })(mod);
        }
    }
};

module.exports = util;