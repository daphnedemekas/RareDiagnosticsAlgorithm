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
  }
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

  origin_url: {
    type: DataTypes.STRING(1024)
  },

  disease_orpha: {
    type: DataTypes.STRING
  },

  symptoms_list: {
    type: DataTypes.STRING(1024)
  }
})

TestCase.sync()

//Define associations.
Disease.belongsToMany(Symptom, {through: 'Correlation', foreignKey: 'disease_orpha'});
Symptom.belongsToMany(Disease, {through: 'Correlation', foreignKey: 'symptom_id'});

//Careful about this line: the symptom is the child of another symptom through the superclass ID.
Symptom.belongsToMany(Symptom,{through: 'SymptomInheritance', as: 'Children', foreignKey:'superclass_id', onDelete: 'SET NULL'});

Symptom.belongsToMany(Symptom,{through: 'SymptomInheritance', as: 'Parents', foreignKey:'subclass_id', onDelete: 'SET NULL'});


async function getParentSymptoms(input_symptoms) {
  const {Op} = require('sequelize');
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
  // const test_disease = await Disease.findOne({
  //   where:{
  //     orpha_number: '564'
  //   },
  //   include: Symptom
  // })
  // console.log(test_disease.disease_name);
  // console.log(test_disease.Symptoms)
  // let symptoms = await test_disease.getSymptoms().catch((err)=> console.log(err))

  // const migrainewaura = await Symptom.findOne({where: {id: 'HP:0002083'}})
  // let parent_symptoms = await migrainewaura.getParent();
  // console.log(migrainewaura)
  // console.log(parent_symptoms)
  // console.log(symptoms[0].toJSON())
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
    getParentSymptoms,
    Op: sequelize.Op
};
