var express = require('express'),
    routeRegistrar = require('route-registrar'),
    utils = require('gammautils'),
    Sequelize = require('sequelize'),
    
    //nodejs native dependencies
    fs = require('fs'),
    path = require('path');

var app = express(),
    isDevelopment = process.env.NODE_ENV === 'development',
    isProduction = process.env.NODE_ENV === 'production',
    sequelize = new Sequelize('knowhow', 'root', 'root', {
        host: '127.0.0.1',
        port: 3306,
        dialect: 'mysql',
        define: {
            charset: 'utf8',
            collation: 'utf8_general_ci'
        }
    }),
    models = {};

var modelsFolder = path.join(__dirname, '/models');

fs.readdirSync(modelsFolder).forEach(function(file) {
    
    var model = sequelize.import(path.join(modelsFolder, file));
    models[model.name] = model;
});

Object.keys(models).forEach(function(modelName) {
  
    if('associate' in models[modelName]){
        models[modelName].associate(models);
    } else {
        throw new Error('Todos os modelos devem ter um método associate!');
    }
});

var routes = routeRegistrar.find(__dirname + '/controllers', app, {
    
    models : models
});

app.configure(function() {

    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    
    app.use(express.static(__dirname + '/static'));
    
    if(isDevelopment) {
        app.use(express.logger('dev'));
    }
    
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(function(req, res, next) {
        sequelize.transaction(function(t) {
            req.transaction = t;
            next();
        })
    });
    app.use(app.router);
});

//Função apenas para desenvolvimento
app.configure('development', function() {
    
    app.locals.pretty = true;
});

routeRegistrar.register(isDevelopment);



if(isProduction) {
    app.use(function(err, req, res, next) {
        //codigo que salva no banco
        res.render('error.jade');
    });
} else {
    app.use(express.errorHandler());
}

//sequelize.sync({force: true}).complete(function(err) {
//
//    if(err) {
//        throw err;
//    }
//});

app.listen(8000);

console.log('Rodando em ' + 8000);
