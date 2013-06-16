/*---------------------
 :: Dashboard
 -> controller
 ---------------------*/
var DashboardController = {

    index:function (req, res) {
        var project = req.params.project;
        if (!project) {
            //TODO: render not found view.
        }

        res.view({project:project, title:project + "-dashboard"});

    },

    // To trigger this action locally, visit: `http://localhost:port/dashboard/config`
    config:function (req, res) {

        // This will render the view: /Users/twer/project/opensource/vital-signs/views/dashboard/config.ejs
        res.view();

    }

};
module.exports = DashboardController;