module.exports = function(sequelize, DataTypes) {
    
    var Usuario = sequelize.define('Usuario', {
        
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            unique: true,
            primaryKey: true
        },
        
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: true,
                notNull: true
            }
        },
        
        senha: {
            type: DataTypes.STRING,
            min: 6
        },
        
        perfis: {
            type: DataTypes.ENUM('financeiro', 'administrativo', 'aluno', 'professor', 'empresa'),
            allowNull: false,
            validate:{
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
        tableName: 'usuarios',
        updatedAt: 'ultimaAlteracao',
        createdAt: 'criadoEm',
        classMethods:{
            associate: function(models) {
                Usuario.belongsTo(models.Contato)
            }
        }
    });

    return Usuario;
}