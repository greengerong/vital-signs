/*---------------------
	:: Dashboard 
	-> controller
---------------------*/
var DashboardController = {

	// To trigger this action locally, visit: `http://localhost:port/dashboard/index`
	index: function (req,res) {

		// This will render the view: /Users/twer/project/opensource/vital-signs/views/dashboard/index.ejs
		res.view();

	},

	// To trigger this action locally, visit: `http://localhost:port/dashboard/config`
	config: function (req,res) {

		// This will render the view: /Users/twer/project/opensource/vital-signs/views/dashboard/config.ejs
		res.view();

	}

};
module.exports = DashboardController;