'use strict';

import mongoose from 'mongoose';

let Schema = mongoose.Schema;

const NoteSchema = Schema({
    text: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

NoteSchema.method("update", function(updates, callback) {
    Object.assign(this, updates, {updatedAt: new Date()});
    this.parent().save(callback);
});

const BrewSchema = new Schema({
    title: String,
    ingredients: String,
    specificGravityInitial: Number,
    specificGravityFinal: {type: Number, default: 0},
    estimatedABV: {type: Number, default: 0},
    state: {type: String, default: "Initial Fermentation"},
    createdAt: {type: Date, default: Date.now},
    notes: [NoteSchema]
});

BrewSchema.pre("save", function(next){
    this.notes.sort();
    next();
});

let Brew = mongoose.model("Brew", BrewSchema);

module.exports.Brew = Brew;




