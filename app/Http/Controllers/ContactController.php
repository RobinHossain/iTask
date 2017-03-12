<?php

namespace App\Http\Controllers;

use App\Contact;
use App\ContactGroup;
use App\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class ContactController extends Controller
{
    /**
     * Get root url.
     *
     * @return \Illuminate\Http\Response
     */
    public function getContacts()
    {
        $contacts = Contact::all();
        return new JsonResponse([
            'message' => 'authenticated_user',
            'data' => $contacts
        ]);
    }

    public function getContactsWithUser(){
        $contacts = Contact::all();
        $uData = JWTAuth::parseToken()->authenticate();
        if(isset($uData->starred) && $uData->starred != ''){
            $uData->starred = unserialize($uData->starred);
        }
        if(isset($uData->frequentContacts) && $uData->frequentContacts != ''){
            $uData->frequentContacts = unserialize($uData->frequentContacts);
        }

        if(isset($uData->groups) && $uData->groups != ''){
            $uData->groups = unserialize($uData->groups);
        }

//        $uData->groups = [
//            [ 'id' => '029384093', 'name' => 'Group', 'contactIds' => [] ]
//        ];

        return new JsonResponse([
            'contacts' => $contacts,
            'user' => $uData
        ]);

    }

    public function addNewContact( Request $request ){
        $this->validate($request, [
            'email' => 'required|email|max:255',
            'name' => 'required',
        ]);

        $contact = new Contact($request->all());

        $contact->save();

        return new JsonResponse([
            'data' => $request->all()
        ]);
    }

    public function updateContact( Request $request ){
        $this->validate($request, [
            'email' => 'required|email|max:255',
            'name' => 'required',
        ]);

        $contact = Contact::find($request->id);

        $contact->update( $request->except('token', 'id') );

        $contact->save();

        if($contact->id){
            return new JsonResponse([
                'data' => $request->all()
            ]);
        }

    }

    public function addStar( Request $request ){
        $this->validate($request, [
            'id' => 'required',
        ]);
        $uData = JWTAuth::parseToken()->authenticate();

        if(isset($uData->starred) && $uData->starred != ''){
            $starredContact = unserialize($uData->starred);
        }

        if(isset($starredContact) && is_array($starredContact)){
            if(in_array($request->id, $starredContact)){
                $key = array_search($request->id, $starredContact);
                array_splice($starredContact, $key, 1);
            }else{
                $starredContact[count($starredContact)] =  $request->id;
            }
        }else {
            $starredContact[0] = $request->id;
        }

        $user = User::find($uData->id);
        $user->starred = serialize($starredContact);
        $user->save();

        return new JsonResponse([
            'data' => 'updated'
        ]);

    }
    
    public function addNewGroup( Request $request ){
        $this->validate($request, [
            'id' => 'required',
            'name' => 'required',
        ]);
        $uData = JWTAuth::parseToken()->authenticate();

        $groups = unserialize($uData->groups);

        if(isset($groups) && is_array($groups)){
            $groups[count($groups)] = [ 'id' => $request->id, 'name' => $request->name, 'contactIds' => [] ];
        }else {
            $groups[0] = [ 'id' => $request->id, 'name' => $request->name, 'contactIds' => [] ];
        }

        $user = User::find($uData->id);
        $user->groups = serialize($groups);
        $user->save();

        return new JsonResponse([
            'data' => 'updated'
        ]);

    }

    public function deleteContact( Request $request ){
        $this->validate($request, [
            'id' => 'required'
        ]);

        Contact::destroy($request->id);

        return new JsonResponse([
            'data' => 'deleted'
        ]);
    }

    public function addToGroup( Request $request ){
        $this->validate($request, [
            'contact' => 'required',
            'group' => 'required'
        ]);

        $uData = JWTAuth::parseToken()->authenticate();
        $groups = unserialize($uData->groups);

//        pr($groups);

        if(isset($groups) && is_array($groups)){

            $initGroup = $groups;
            foreach($groups as $groupKey => $group){
                if($group['id'] == intval($request->group)){
                    $newGroup = $group;
                    if(is_array($group['contactIds']) && count($group['contactIds']) > 0){

                        $key = array_search ($request->contact, $group['contactIds']);
                        if(is_int($key) && $key >= 0){
                        }else{
                            $newGroup['contactIds'][count($group['contactIds'])] = intval($request->contact);
                        }
                    }else {
                        $newGroup['contactIds'][0] = intval($request->contact);
                    }

                    $initGroup[$groupKey] =  $newGroup;

                }

//                $initGroup = [];
                $user = User::find($uData->id);
                $user->groups = serialize($initGroup);
                $user->save();
            }
        }

        return new JsonResponse([
            'data' => 'added'
        ]);

    }

    public function removeFromGroup( Request $request ){
        $this->validate($request, [
            'contact' => 'required',
            'group' => 'required'
        ]);

        $uData = JWTAuth::parseToken()->authenticate();
        $groups = unserialize($uData->groups);

        if(isset($groups) && is_array($groups)){

            $initGroup = $groups;
            foreach($groups as $groupKey => $group){
                if($group['id'] == $request->group){
                    $newGroup = $group;
                    if(is_array($group['contactIds']) && count($group['contactIds']) > 0){

                        $key = array_search ($request->contact, $group['contactIds']);
                        if(is_int($key) && $key >= 0){
                            array_splice($newGroup['contactIds'], $key, 1);
                        }
                    }

                    $initGroup[$groupKey] =  $newGroup;

                }else{
                    pr('not found');
                }

                $user = User::find($uData->id);
                $user->groups = serialize($initGroup);
                $user->save();

            }
        }

        return new JsonResponse([
            'data' => 'removed'
        ]);

    }

    public function deleteGroup( Request $request ){
        $this->validate($request, [
            'id' => 'required'
        ]);

        $uData = JWTAuth::parseToken()->authenticate();
        $groups = unserialize($uData->groups);

        if(isset($groups) && is_array($groups)){

            $initGroup = $groups;
            foreach($groups as $groupKey => $group){
                if($group['id'] == $request->id){
                    array_splice($initGroup, $groupKey, 1);
                }

                $user = User::find($uData->id);
                $user->groups = serialize($initGroup);
                $user->save();

            }
        }

        return new JsonResponse([
            'data' => 'deleted'
        ]);
    }
    
    
}
