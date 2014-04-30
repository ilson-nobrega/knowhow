var ie = require('inscricaoestadual');


module.exports = function(sequelize, DataTypes) {
    
    var Contato = sequelize.define('Contato', {
        
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            unique: true,
            primaryKey: true
        },
        
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate:{
                notNull: true
            }
            
        },
        
        registroNacional: {
            type: DataTypes.STRING(14),
            allowNull: false,
            validate: {
                len: [11, 14],
                notNull: true
            }
        },
        
        registroEstadual: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                eInscricaoEstadual: function(value) {
                    if(this.tipo === 'pessoaFisica') {
                        return true;
                    } else {
                        return ie(value);
                    }
                },
                notNull: true
            }
        },
        
        tipo: {
            type: DataTypes.ENUM('pessoaFisica', 'pessoaJuridica'),
            allowNull: false,
            validate: {
                notNull: true
            }
        }
    },{
        freezeTableName: true,
        tableName: 'contatos',
        updatedAt: 'ultimaAlteracao',
        createdAt: 'criadoEm',
        classMethods:{
            associate: function(models) {
                Contato.hasMany(models.Usuario),
                Contato.hasMany(models.Endereco),
                Contato.hasMany(models.Telefone)
            }
        }
    });

    return Contato;
}