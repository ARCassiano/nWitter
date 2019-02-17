module.exports = function(app){
    var NweetController = {

          submit: function(req,res){

            req.assert(req.body.texto, 'Insira o conteúdo do seu nweet').isEmpty();

            var errors = req.validationErrors();

            if(errors){
                res.render("index", {'errors': errors});
            }else{
                var nweetModel = app.models.nweet;
                var nweet = {
                    autor: req.session.usuario._id,
                    texto: req.body.texto
                }

                nweetModel.create(nweet, function(error, nweet){
                    res.redirect("/");
                });
            }
        }
    }

    return NweetController;
};