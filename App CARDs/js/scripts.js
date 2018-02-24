function listarCards(){

	$(".divPage").hide();
	$("#txtTitulo").html("Lista de Cards");
	$("#divAtualizando").show();

	firebase
		.database()
		.ref("cards")
		.on("value", function(snapshot){

			$("#menu").show();
			$("#divCards").empty();

			snapshot.forEach(function(child) {
				
				var card = '<div class="col-sm-2" id="card'+ child.key + '">' +
				  '<div class="card">' +
					'<img class="card-img-top" src="' + child.val().foto + '" alt="Card image cap">' +
					'<input type="hidden" id="key_editar" value="'+ child.key +'"/>' +
					'<input type="hidden" id="qtde_likes" value="'+ child.val().likes +'"/>' +
					'<input type="hidden" id="nomeFoto" value="'+ child.val().nomeFoto +'"/>' +
					'<div class="card-body">' +
						'<p class="card-text">' + child.val().descricao + '</p>' +
						'<button type="button" class="btn btn-primary" onclick="likeCard(\''+ child.key +
						'\')" id="btnLike'+ child.key +'">Like (' + child.val().likes + ')</button>' +
						'<button type="button" class="btn btn-danger" data-toggle="modal" ' +
						'data-target="#confirm" onclick="excluirCard(\''+ child.key + '\',\'' + child.val().nomeFoto + '\')">Excluir</button>' +
					'</div>' +
				  '</div><br>' +
				'</div>';
				$("#divCards").append(card);

			}) 

			$("#divAtualizando").fadeOut("slow");

		})

}

function cadastrarCard() {

	$("#divCarregandoFoto").show();
	$("#upload_foto").val(0);

	//--- primeiro salvar a imagem

	var file = $("#foto")[0].files[0];

	// enviar para o upload
	var task = firebase
				.storage()
				.ref("cards/"+file.name)
				.put(file);

	// fica escutando o envio do upload
	task.on('state_changed',
		function progress( snapshot ){
			var parcial = snapshot.bytesTransferred ;
			var total = snapshot.totalBytes;
			var porcentagem = (parcial / total) * 100;
			$("#upload_foto").val(porcentagem);
		},
		function error( error ){
			alert("Error ao carregar a foto!");
			console.error(error.message);
		},
		function complete(){

			firebase
				.storage()
				.ref("cards/"+file.name)
				.getDownloadURL()
				.then(function( url ){

					var data = {
						descricao: $("#descricao").val(),
						foto: url,
						likes: 0,
						nomeFoto: "cards/" + file.name
					}

					firebase.database()
						.ref("cards")
						.push(data)
						.then(function(result){
							$("#divCarregandoFoto").hide();
							alert("Foto Carregada com Sucesso!");
							$("#descricao").val('');
							$("#upload_foto").val(0);
							console.log(result);
						})
						.catch(function(error){
							$("#divCarregandoFoto").hide();
							alert("Erro ao Carregar Foto!");
							console.log(error.message);
						});

				})
				.catch(function(error){
					$("#divCarregandoFoto").hide();
					alert("Erro ao obter a URL da foto!");
					console.error(error.message);
				});

		});

}

function excluirCard(key, nomeFoto) {

	var retorno = confirm("Deseja realmente excluir o registro ?");

	if ( retorno ) {

		firebase.database().ref("cards/" + key).remove()
			.then(function(result){
				console.log("Registro excluído...");
				firebase.storage().ref(nomeFoto).delete()
					.then(function(result){
						console.log("Foto excluída...");
					})
					.catch(function(error){
						alert("Erro (1) ao Exluir o registro!");
						console.log(error.message);
					});

			})
			.catch(function(error){
				alert("Erro (2) ao Excluir o registro!");
				console.log(error.message);
			});

	}
}

function likeCard(key) {

	firebase
		.database()
		.ref("cards/" + key)
		.once('value')
		.then(function(snapshot){

			var likes = snapshot.val().likes;

			likes ++;

			$("#qtde_likes").val(likes);
			$("#btnLike"+key).text("Like ("+likes+")");

			var data = {
				likes: likes
			}

			firebase.database().ref("cards/" + key).update(data)
				.then(function(result){
				})
				.catch(function(error){
					alert("Erro ao Alterar o Like!");
					console.log(error.message);
				});

		})
		.catch(function(){
			alert("Erro ao obter o card selecionado.")
		});

}