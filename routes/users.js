module.exports = function(app){
  var usuario = app.controllers.usuario;
  var isLoggedIn = function(req, res, next){
    if(typeof(req.session.usuario) != "undefined"){
      if(req.session.usuario != ""){
        res.redirect("/");      
      }
    }
    next();
  }

  app.get("/usuario/login", isLoggedIn, usuario.login);
  app.post("/usuario/login", isLoggedIn, usuario.loginAction);
  app.get("/usuario/cadastro", usuario.cadastro);
  app.post("/usuario/cadastro", usuario.cadastroAction);
  app.get("/usuario/logout", usuario.logout);
}