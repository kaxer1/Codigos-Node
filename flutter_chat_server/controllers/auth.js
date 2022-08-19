const { response } = require("express");
const bcript = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;
    try {
        const existeEmail = await Usuario.findOne({email});
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            })
        }

        const usuario = new Usuario(req.body);

        const salt = bcript.genSaltSync();
        usuario.password = bcript.hashSync(password, salt );

        await usuario.save();

        const token = await generarJWT(usuario.id);
        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
    
}

const login = async(req, res = response) => {
    const { email, password } = req.body;
    try {
        
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Email no encontrado'
            })
        }

        const validPassword = bcript.compareSync( password, usuarioDB.password );
        if (!validPassword) {
            return res.status(400).json({
                ok:false,
                msg:'La contraseña no es valida'
            })
        }

        const token = await generarJWT(usuarioDB.id);
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const renewToken = async( req, res = response) => {

    try {
        const uid = req.uid;
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no Valido'
            })
        }
        const token = await generarJWT(usuario.id);
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    crearUsuario,
    login,
    renewToken
}