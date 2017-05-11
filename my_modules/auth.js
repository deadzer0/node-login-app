// Authentication function, can be passed as second parameter at any route to secure it

exports.ensureAuth = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        // req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
};