# RareDiagnosticsAlgorithm
## The environment variables
Before running the application, make sure you have got the proper environment variables set. Either set them manually on your environment, or create (or edit)
the file `.env` in the root directory. For example the following is my `.env` file. 

    NODE_ENV=development
    SQL_HOST=localhost
    SQL_USER=axel
    SQL_PASSWORD=pass
    SQL_DB=RareDiagnostics 

The `.env` file is especially practical for us to go from machine to machine, etc... Note however that **in production environment or in the AWS Cloud, this file
will not be read and the environment variables need to be set in the EC2 (or ElasticBeanstalk in our case) instance's configuration. ** See for example [this link](https://alexdisler.com/2016/03/26/nodejs-environment-variables-elastic-beanstalk-aws/#:~:text=Elastic%20Beanstalk%20lets%20you%20enter,of%20properties%20you%20can%20configure.)
for examples on how to this. The application expect an additional `IS_AWS` environment variable (which is true or false), which tells us if it is running on the AWS cloud.
This variable is currently set in the existing instances, but don't forget to set it if you create new instances to run this application. 
