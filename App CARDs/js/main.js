
// Initialize Firebase
var config = {
	apiKey: "AIzaSyDeQuEkf16Kn8wKINQIGeD7QE0KB-gPP9g",
	authDomain: "posunifacs-149ab.firebaseapp.com",
	databaseURL: "https://posunifacs-149ab.firebaseio.com",
	projectId: "posunifacs-149ab",
	storageBucket: "posunifacs-149ab.appspot.com",
	messagingSenderId: "667750937483"
};
firebase.initializeApp(config);

$(document).ready(function(){
	pageLogin();
});