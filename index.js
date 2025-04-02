const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 4002;
const mongoose = require("mongoose");
const Produit = require('./Produit');
app.use(express.json());


mongoose.set('strictQuery', true);

async function connectDB() {
    try {
        await mongoose.connect("mongodb://localhost/produit-service");
        console.log('Produit-Service DB Connected');
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1); 
    }
}

connectDB(); 

app.post('/produit/ajouter', async (req, res) => {
    try {
        const { nom, description, prix } = req.body;
        const newProduit = new Produit({ nom, description, prix });
        const produit = await newProduit.save();
        res.status(201).json(produit);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


app.post('/produit/acheter', async (req, res) => {
    try {
        const ids = req.query.ids ? req.query.ids.split(',') : [];  
        const produits = await Produit.find({ '_id': { $in: ids } });
        res.status(200).json(produits);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Product-Service at ${PORT}`);
});