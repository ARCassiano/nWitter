module.exports = app => {
    var UsuarioController = {

          login: function(req, res){
                res.render('usuario/login');
          },

          loginAction: function(req, res){
            
            req.assert(req.body.nickname, 'Insira um apelido').isEmpty();
            req.assert(req.body.senha, 'Insira uma senha de no mínimo 6 caracteres').isEmpty();
  
            var errors = req.validationErrors();
  
              if(!errors){
                  var usuarioModel = app.models.usuario;
                  var query = {nickname: req.body.nickname, senha: req.body.senha};
  
                  usuarioModel.findOne(query).select('nome email nickname').exec(function(error, usuario){
                        if(usuario){
                              req.session.usuario = usuario;
                              res.redirect('/');
                        }else{
                              res.render('usuario/login', {'errors': [{'msg': 'Nickname ou Senha inválida'}]})
                        }
                  });
                }else{
                  res.render('usuario/login', {'errors': errors});
                }
          },

          logout: function(req, res){
            if(typeof(req.session.usuario) != "undefined"){
              req.session.destroy();
              res.redirect("/");
            }
          },

          cadastro: function(req, res){
            res.render("usuario/cadastro");
          },

          cadastroAction: function(req, res){

            req.assert(req.body.nome, 'Insira seu nome completo').isEmpty();
            req.assert(req.body.nickname, 'Insira um apelido').isEmpty();
            req.assert(req.body.email, 'Insira uma conta de e-mail válida').isEmpty();
            req.assert(req.body.senha, 'Insira uma senha de no mínimo 6 caracteres').isEmpty();
            req.assert(req.body.conf_senha, 'Confira sua senha').isEmpty();

            var errors = req.validationErrors();

            if(errors){
                  res.render("usuario/cadastro", {'errors': errors});
            }else{
                  var usuarioModel = app.models.usuario;
                  var usuario = {
                        nome: req.body.nome,
                        nickname: req.body.nickname,
                        email: req.body.email,
                        senha: req.body.senha,
                  };

                  usuarioModel.create(usuario, function(error, usuario){                        
                        if(error){
                              res.render("usuario/cadastro", {'errors': [{'msg': error.err}]});
                        }else{
                              res.redirect("/usuario/login");
                        }
                  });
            }
          }
    }

    return UsuarioController;
};