function pageLogin() {

	//var user = firebase.auth().currentUser;

	firebase.auth().onAuthStateChanged(function(user){
		if (user) {
			listarCards();
		}
	});

	$(".divPage").hide();
	$("#txtTitulo").html("Login");
	$("#login").show();	
	
}

function criarUsuario() {

	var email = $("#email_login").val();
	var senha = $("#senha_login").val();

	firebase
		.auth()
		.createUserWithEmailAndPassword(email, senha)
		.then(function(user){

			alert("Usuário Cadastrado com Sucesso! Faça o Login");
			$("#formLogin").trigger("reset");	
			console.log(user);

		})
		.catch(function(error){

			alert("Erro ao cadastrar o login. Tente outro E-Mail!");
			console.log(error.message);

		});
}

function login() {

	var email = $("#email_login").val();
	var senha = $("#senha_login").val();

	firebase
		.auth()
		.signInWithEmailAndPassword(email, senha)
		.then(function(user){

			$("#formLogin").trigger("reset");	
			console.log(user);

			listarCards();

		})
		.catch(function(error){

			alert("Erro ao efetuar o login. Tente novamente!");
			console.log(error.message);

		});
}

function sair() {

	var email = $("#email_login").val();
	var senha = $("#senha_login").val();

	firebase
		.auth()
		.signOut();

	pageLogin();
}

function logarComFaceBook(){

	// criar provedor do facebook

	var provedor = new firebase.auth.FacebookAuthProvider();

	logarComProvedor( provedor );

}

function logarComGitHub(){

	// criar provedor do facebook

	var provedor = new firebase.auth.GithubAuthProvider();

	logarComProvedor( provedor );

}

function logarComGoogle(){

	// criar provedor do facebook

	var provedor = new firebase.auth.GoogleAuthProvider();

	logarComProvedor( provedor );

}

function logarComProvedor( provedor ){

	firebase.auth().signInWithPopup(provedor)
		.then(function( user ){
			console.log("user...",user);
			pageListar();
		})
		.catch(function(error){
			alert("Erro ao acessar o provedor.");
			console.error("Error...",error.message)
		});

}