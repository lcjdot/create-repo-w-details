// Commands:
//   hubot create repo <name> desc <name> - creates CC repo and returns details

var aws     = require('aws-sdk');
var promise = require('bluebird');
var codecommit = new aws.CodeCommit({region: 'us-east-1'});
var util = require('util');

module.exports = function(robot) {
    robot.respond (/create repo ([a-z0-9]+) desc (.*)/i, function(msg) {
        var repo = msg.match[1].toLowerCase()
        var desc = msg.match[2]
        message = "";

        return new promise(function(resolve, reject) {
                codecommit.createRepository({repositoryName : repo, repositoryDescription : desc }, function(err,data) {
                if(err) {
                    reject(err);
                }

                resolve(data);
            });
        }).then(function(data) {
            message = message + "Repository name is " + repo + "\n";
            message = message + "Repository description is " + desc + "\n";
            message = message + "HTTP Clone URL is " + data.repositoryMetadata.cloneUrlHttp + "\n";
            message = message + "SSH Clone URL is " + data.repositoryMetadata.cloneUrlSsh + "\n";
            message = message + "Repository ARN is " + data.repositoryMetadata.Arn + "\n";
            msg.send("```" + message + "```");
        }).catch(function(e) {
            msg.send("```" + e + "```");
        });
    });
};
