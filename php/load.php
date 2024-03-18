#!/usr/bin/php-cgi
<?php
    session_start();
    $ret = new stdClass();
    $ret->pairs = $_SESSION['pairs'];
    $ret->points = $_SESSION['points'];
    $ret->cards = $_SESSION['cards'];
    

    $conn = oci_connect('u1988493', 'opgjqnsf', 'ORCLCDB');
	$select = "SELECT *
		FROM memory_save
		ORDER BY id DESC
		FETCH FIRST 1 ROW ONLY";
	
    $comanda = oci_parse($conn, $select);
    oci_execute($comanda);
	
	while (($fila = oci_fetch_array($comanda, OCI_ASSOC + OCI_RETURN_NULLS)) != false) {
		$ret->pairs = $fila['PAIRS'];
		$ret->points = $fila['POINTS'];
		$ret->cards = $fila['CARDS'];
    }

    # Baixar de la base de dades
    echo json_encode($ret);



?>

