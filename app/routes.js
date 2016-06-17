
module.exports = function(app){
    app.get('/index.html', function(req, res){
        // res.send(__dirname);
        res.sendFile(__dirname + '/views/index.html');
    });
    app.get('/index_stylesheet.css', function(req, res){
        // res.send(__dirname);
        res.sendFile(__dirname + '/views/index_stylesheet.css');
    });
    app.get('/controllers/index_controller.js', function(req, res){
        // res.send(__dirname);
        res.sendFile(__dirname + '/controllers/index_controller.js');
    });
}