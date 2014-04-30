var async = require('async'),
    brasil = require('brasil'),

    Contato,
    Usuario;

function getLogin(req, res, next) {

	res.render('login/login');
}

function postLogin(req, res, next) {
    
    var login = req.body.login;
    
    Usuario.find({
        where: {
            email: login.email,
            senha: login.senha
        }
    }).complete(function(err, user){
        
        if(err){
            return next(new Error('Ocorreu um erro ao buscar o usuário: ' + err));
        }else if(!user){
            return next(new Error('Usuário ou senha incorretos!'));
        }else{
            
            res.redirect('principal');
        }
    });
	
}

function getFormularioDeCadastro(req, res, next){
    
    res.render('usuario/cadastro');
}

function postUsuario(req, res, next){
    
    var contato = req.body.contato,
        usuario = req.body.usuario,
        opcoes = { 
            transaction: req.transaction 
        };
    
    if(usuario.senha !== usuario.confirmacaoSenha) {
        return next(new Error('As senhas devem ser iguais.'));
    }
    
    contato.tipo = {
        cpf: 'pessoaFisica',
        cnpj: 'pessoaJuridica'
    }[brasil.validacoes.eRegistroNacional(contato.registroNacional)];
    
    if(!contato.tipo){
        return next(new Error('O CPF ou CNPJ informado é inválido.'))
    }
    
    usuario.perfis = 'aluno';
    
    function inserirContato(callback) {
        
        Contato.create(contato, opcoes).done(callback);
    }
    
    function inserirUsuario(contato, callback) {
        
        console.log(contato.dataValues.id);
        usuario.contatosId = contato.dataValues.id;
        Usuario.create(usuario, opcoes).done(callback);
    }
    
    async.waterfall([inserirContato, inserirUsuario], function(err) {
        if(err) {
            req.transaction.rollback();
            return next(new Error(JSON.stringify(err)));
        }
        
        req.transaction.commit();
        res.send(200);
    })
}

exports.init = function(app, params) {
    Contato = params.models.Contato;
    Usuario = params.models.Usuario;
    
    app.get('/login', getLogin);
    app.get('/cadastro', getFormularioDeCadastro);

    app.post('/login', postLogin);
    app.post('/cadastro', postUsuario);
}