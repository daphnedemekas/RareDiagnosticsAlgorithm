const { Sequelize,DataTypes } = require('sequelize');

//Check that we are not in production environment or in the AWS cloud.
//In these cases, the environment variables should be set on the machine
if (process.env.NODE_ENV != 'prod' && !process.env.IS_AWS) {
  require('dotenv').config();
}

// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize('RareDiagnostics', process.env.SQL_USER, process.env.SQL_PASSWORD, {
  host: process.env.SQL_HOST,
  dialect: 'mariadb',
  logging: false,

  // Avoid auto-pluralization
  define: {
    timestamps: false
  }
});

//Now we define the Model
const Disease = sequelize.define('Disease',{
  orpha_number: {
    type: DataTypes.STRING(10),
    primaryKey: true
  },

  disease_name: {
    type: DataTypes.STRING(255)
  },

  type: {
    type: DataTypes.STRING(100)
  },

  definition: {
    type: DataTypes.TEXT
  },
})

const Symptom = sequelize.define('Symptom',{
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },

  symptom_name: {
    type: DataTypes.STRING
  },

  definition: {
    type: DataTypes.TEXT
  },
})

const Correlation = sequelize.define('Correlation',{
  disease_orpha: {
    type: DataTypes.STRING,
    references: {
      model: Disease,
      key: 'orpha_number'
    }
  },

  symptom_id: {
    type: DataTypes.STRING,
    references: {
      model: Symptom,
      key: 'id'
    }
  },

  frequency: {
    type: DataTypes.FLOAT(3)
  }
})

const SymptomInheritance = sequelize.define('SymptomInheritance', {
  superclass_id: {
    type: DataTypes.STRING,
    references: {
      model: Symptom,
      key: 'id'
    }
  },

  subclass_id: {
    type: DataTypes.STRING,
    references: {
      model: Symptom,
      key: 'id'
    }
  }
})

const TestCase = sequelize.define('TestCase',{
  origin: {
    type: DataTypes.STRING
  },

  //1 test case per URL
  origin_url: {
    type: DataTypes.STRING(1024),
    unique: true,
  },

  disease_orpha: {
    type: DataTypes.STRING,
  },

  symptoms_list: {
    type: DataTypes.STRING(1024)
  }
})

//Define associations.
Disease.belongsToMany(Symptom, {through: 'Correlation', foreignKey: 'disease_orpha'});
Symptom.belongsToMany(Disease, {through: 'Correlation', foreignKey: 'symptom_id'});

//Careful about this line: the symptom is the child of another symptom through the superclass ID.
Symptom.belongsToMany(Symptom,{through: 'SymptomInheritance', as: 'Children', foreignKey:'superclass_id', onDelete: 'SET NULL'});

Symptom.belongsToMany(Symptom,{through: 'SymptomInheritance', as: 'Parents', foreignKey:'subclass_id', onDelete: 'SET NULL'});

TestCase.belongsToMany(Symptom, {through: 'TestCasesSymptomsAssocations', foreignKey: 'id'})
Symptom.belongsToMany(TestCase,{through: 'TestCasesSymptomsAssocations'})

Disease.hasMany(TestCase)
TestCase.belongsTo(Disease)

sequelize.sync({alter: true})

async function getParentSymptoms(input_symptoms) {
  return Symptom.findAll({
    include: {
      model: Symptom,
      as:   'Children',
      where: {
        symptom_name:{
          [Op.in]: input_symptoms
        }
      }
    }
  })
}

//Test connection
async function testConnection(){
  await sequelize.authenticate();
  console.log('Connection to RareDiagnostics DB has been established successfully.');
}
try {
  testConnection()
} catch (error) {
  console.error('Unable to connect to the database:', error);
}


module.exports = {
    sequelize: sequelize,
    Disease: Disease,
    Symptom: Symptom,
    Correlation: Correlation,
    SymptomInheritance: SymptomInheritance,
    TestCase: TestCase,
    getParentSymptoms,
    Op: sequelize.Op
};
