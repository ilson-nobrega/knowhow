module.exports = function(sequelize, DataTypes) {
    
    var Telefone = sequelize.define('Telefone', {
        
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            unique: true,
            primaryKey: true
        },
        
        telefone: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true
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
            type: DataTypes.ENUM('celular', 'residencial', 'comercial', 'fax', 'outro'),
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
        tableName: 'telefones',
        updatedAt: 'ultimaAlteracao',
        createdAt: 'criadoEm',
        classMethods:{
            associate: function(models) {
                Telefone.belongsTo(models.Contato)
            }
        }
    });

    return Telefone;
}