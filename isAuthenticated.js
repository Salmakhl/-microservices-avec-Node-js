const jwt = require('jsonwebtoken');

module.exports = async function isAuthenticated(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ message: err });
        } else {
            req.user = user;
            next();
        }
    });
};
app.post("/commande/ajouter", isAuthenticated, async (req, res, next) => {
    // Création d'une nouvelle commande dans la collection commande
    const { ids } = req.body;
    httpRequest(ids).then(total => {
        const newCommande = new Commande({
            produits: ids,
            email_utilisateur: req.user.email,
            prix_total: total,
        });
        newCommande.save()
            .then(commande => res.status(201).json(commande))
            .catch(error => res.status(400).json({ error }));
    });
});