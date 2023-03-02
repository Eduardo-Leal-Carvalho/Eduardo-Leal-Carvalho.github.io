<!doctype html>
<html lang="pt-br">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="bootstrap-4.6.2-dist/css/bootstrap.min.css">

  <title>Teste Robert</title>

  <!-- Optional JavaScript; choose one of the two! -->

  <!-- Option 1: jQuery and Bootstrap Bundle (includes Popper) -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>

  <!--<script src="jquery-3.5.1-dist/jquery-3.5.1.slim.min.js"></script> <-->
  <script src="bootstrap-4.6.2-dist/js/bootstrap.bundle.min.js"></script>

  <!-- CSS -->
  <style type="text/css">
    #hero {
      height: 200px;
    }
  </style>

  <script type="text/javascript">
    $(document).ready(function() {
      $("#submit").prop('disabled', true);

      $("#scanCodigo").keyup(function() {
        var codigoTam = this.value.length;
        if (codigoTam == 8) {
          $("#submit").prop('disabled', false);
        } else {
          $("#submit").prop('disabled', true);
        }
      });
    });
  </script>

</head>

<body>

  <div class="container">

    <div id="hero">
    </div>
    <div class="col text-center">
      <img src="Imagens/senac.png">
    </div>
    <form method="POST" action="principal.php">
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="scanCodigo">Escaneie o código de barra</label>
            <input type="text" name="Scan" class="form-control" id="scanCodigo" minlength="8" maxlength="8" aria-describedby="area para escanear codigo de barra" autofocus required>
          </div>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col text-center">
          <button type="button" class=" btn btn-primary text-white" type="submit" id="submit" class="btn btn-primary">Enviar</button>
        </div>
      </div>
    </form>
    <!-- PHP -->
    <?php
    if ($_POST) {
      $codigo = $_POST['Scan'];


      if ($codigo == 11111111) {
        echo "
    <div class='card text-center' style='width: 18rem;'>
      <img src='Imagens/tomate.jpg' class='card-img-top' alt='Card de Produto X'>
      <div class='card-body bg-primary text-white'>
        <h5 class='card-title'>Tomate Marca X</h5>
        <p class='card-text'>Tomate marca X por apenas <b>R$ 00,00</b></p>
      </div>
    </div>
    ";
      }
    }
    ?>
    <!-- Final PHP -->
  </div>
</body>

</html>