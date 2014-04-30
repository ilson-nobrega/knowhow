var brasil = require('brasil');

module.exports = function(sequelize, DataTypes) {
    
    var Endereco = sequelize.define('Endereco', {
        
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            unique: true,
            primaryKey: true
        },
        
        logradouro: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true
            }
        },
        
        numero:{
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true
            }
        },
        
        complemento: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true
            }
        },
        
        cep: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
                eCep: brasil.eCep
            }
        },
        
        bairro: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true
            }
        },
        
        municipio: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true
            }
        },
        
        uf: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
                max: 2,
                min: 2
            }
        },
        
        descricao: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true
            }
        },
        
        tipo: {
            type: DataTypes.ENUM('residencial', 'comercial', 'outro'),
            allowNull: false,
            validate: {
                notNull: true
            }
        },
        
        contatosId: {
            type: DataTypes.INTEGER,
            references: 'contatos',
            referencesKey: 'id',
            onDelete: 'cascade'
        }
        
    },{
        freezeTableName: true,
        tableName: 'enderecos',
        updatedAt: 'ultimaAlteracao',
        createdAt: 'criadoEm',
        classMethods:{
            associate: function(models) {
                Endereco.belongsTo(models.Contato)
            }
        }
    });

    return Endereco;
}