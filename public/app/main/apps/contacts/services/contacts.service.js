(function ()
{
    'use strict';

    angular
        .module('app.contacts')
        .factory('ContactsService', ContactsService);

    /** @ngInject */
    function ContactsService(msApi, $q, $cookies, $http)
    {
        var service = {
            data      : [],
            contacts      : [],
            userData      : [],
            addNewContact   : addNewContact,
            updateContact   : updateContact,
            addNewGroup   : addNewGroup,
            getContactsWithUser   : getContactsWithUser,
            addContactStar   : addContactStar,
            deleteContact   : deleteContact,
            assignContactGroup   : assignContactGroup,
            deleteGroup   : deleteGroup,
        };

        var token = $cookies.get('token');
        var siteUrl = "api/";
        // var siteUrl = "http://localhost:8000/api/";

        /**
         * Get All Contact and Current User Info
         */
        function getContactsWithUser(){
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: siteUrl + 'contacts' + '?token=' + token
            }).then(function successCallback(response) {

                service.contacts = response.data.contacts;
                service.userData = response.data.user;
                deferred.resolve(response);

            }, function errorCallback(response) {
                console.log(response);
                deferred.reject(response);
            });
            return deferred.promise;
        }

        /**
         * Delete Existing Group
         */
        function deleteGroup(id){
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: siteUrl + 'contact/group/delete' + '?token=' + token,
                data: { id: id }
            }).then(function successCallback(response) {

                // console.log(response.data);
                deferred.resolve(response);

            }, function errorCallback(response) {
                console.log(response);
            });
        }

        /**
         * Add new Contact
         * @param contact
         */
        function addNewContact(contact) {
            var postData = contact;
            postData.token = token;
            delete postData.tags;
            console.log(postData);
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: siteUrl + 'contact/new' + '?token=' + token,
                data: postData
            }).then(function successCallback(response) {

                service.contacts.push(contact);
                // console.log(response.data);
                deferred.resolve(response);

            }, function errorCallback(response) {
                console.log(response);
                deferred.reject(response);
            });
            return deferred.promise;
        }

        function addContactStar(id) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: siteUrl + 'contact/addStar' + '?token=' + token,
                data: { id: id }
            }).then(function successCallback(response) {

                // console.log(response.data);
                deferred.resolve(response);

            }, function errorCallback(response) {
                console.log(response);
                deferred.reject(response);
            });
            return deferred.promise;
        }

        /**
         * Delete Existing Contact
         */
        function deleteContact(id) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: siteUrl + 'contact/delete' + '?token=' + token,
                data: { id: id }
            }).then(function successCallback(response) {

                // console.log(response.data);
                deferred.resolve(response);

            }, function errorCallback(response) {
                console.log(response);
            });
        }

        /**
         * Assign Contact To A Group
         */
        function assignContactGroup( contactId, groupId ){

            $http({
                method: 'POST',
                url: siteUrl + 'contact/assign/group' + '?token=' + token,
                data: { contact: contactId, group: groupId }
            }).then(function successCallback(response) {

                console.log(response.data);


            }, function errorCallback(response) {
                console.log(response);
            });
        }


        /**
         * Update Contact
         * @param contact
         */
        function updateContact(contact) {
            var postData = contact;
            postData.token = token;
            delete postData.tags;
            console.log(postData);
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: siteUrl + 'contact/update' + '?token=' + token,
                data: postData
            }).then(function successCallback(response) {

                // console.log(response.data);
                deferred.resolve(response);

            }, function errorCallback(response) {
                console.log(response);
                deferred.reject(response);
            });
            return deferred.promise;
        }

        /**
         * Add A new Group
         */
        function addNewGroup(group) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: siteUrl + 'contact/group/add' + '?token=' + token,
                data: group
            }).then(function successCallback(response) {

                // console.log(response.data);

                // userData.group.push(group)


                deferred.resolve(response);

            }, function errorCallback(response) {
                console.log(response);
                deferred.reject(response);
            });
            return deferred.promise;
        }

        /**
         * Add Note
         * @param note
         */
        function addNote(note)
        {
            service.data.push(note);
        }



        function getUserDetails()
        {
            $http({
                method: 'GET',
                url: siteUrl + 'auth/user' + '?token=' + token
            }).then(function successCallback(response) {

                service.userData = response.data.data;


            }, function errorCallback(response) {
                console.log(response);
            });
        }

        /**
         * Update Note
         * @param note
         */
        function updateNote(note)
        {
            for ( var i = 0; i < service.data.length; i++ )
            {
                if ( service.data[i].id === note.id )
                {
                    service.data[i] = note;
                }
            }
        }

        /**
         * Delete Note
         * @param note
         */
        function deleteNote(note)
        {
            for ( var i = 0; i < service.data.length; i++ )
            {
                if ( service.data[i].id === note.id )
                {
                    service.data.splice(i, 1);
                }
            }
        }
        

        return service;

    }
})();