var aceito_1 = 0;
var aceito_2 = 0;

var number_edges = 0;
var number_nodes = 0;
// create an array with nodes
var nodes = new vis.DataSet([]);

// create an array with edges
var edges = new vis.DataSet([]);

// create a network
var container = document.getElementById("dom");

// provide the data in the vis format
var data = {
  nodes: nodes,
  edges: edges
};

document.addEventListener("keydown", function(e) {
  console.log("a");
  if (e.keyCode == 65) network.addNodeMode();
  if (e.keyCode == 69) network.addEdgeMode();
});

var options = {
  physics: false,

  edges: {
    arrows: "to",
    smooth: false
  },

  manipulation: {
    enabled: true,
    initiallyActive: false,
    addNode: function(nodeData, callback) {
      nodeData.label = "q" + number_nodes;
      nodeData.id = number_nodes;
      number_nodes++;
      callback(nodeData);
    },
    addEdge: function(edgeData, callback) {
      var lb = prompt("Insira o valor:");
      edgeData.label = lb;

      edgeData.id = number_edges;

      //Verificando se ja existe alguma ligaçao entra os nos
      var edgs = edges.get({
        filter: function(item) {
          return item.to == edgeData.to && item.from == edgeData.from;
        }
      });

      edgeData.font = {
        vadjust: 10 * (edgs.length + 1)
      };

      console.log("Numero de ligaçoes: " + edgs.length);

      number_edges++;

      callback(edgeData);

      verificarLigacoes();
    },
    editNode: function(node, callback) {
      callback(node);
      verificarLigacoes();
    },
    editEdge: false,
    deleteNode: function(node, callback) {
      callback(node);
      verificarLigacoes();
    },
    deleteEdge: function(node, callback) {
      callback(node);
      verificarLigacoes();
    },
    controlNodeStyle: {
      // all node options are valid.
    }
  },

  interaction: {
    keyboard: {
      enabled: true
    },
    navigationButtons: true
  }
};

// initialize your network!
var network = new vis.Network(container, data, options);

function inicial() {
  var val = document.getElementById("inicial").value;
  var node = nodes.get(val[1]);

  if (val == "" || val.length != 2 || node == null) {
    alert("Node inexistente!");
    return;
  }

  nodes.update({
    id: parseInt(val[1]),
    color: {
      background: "#66ff33"
    }
  });
}

function finais() {
  var str = document.getElementById("finais").value;
  var comma = ",";
  var finais = str.split(comma);

  finais.forEach(function(elm, index, array) {
    nodes.update({
      id: parseInt(elm[1]),
      color: {
        background: "#ff4d4d"
      }
    });
  });
}

function nodeInicial() {
  return nodes.get({
    filter: function(item) {
      if (item.color != undefined) return item.color.background == "#66ff33";
    }
  });
}

function preVerificacao() {
  var entrada_1 = document.getElementById("in-1").value;
  var entrada_2 = document.getElementById("in-2").value;
  var node = nodeInicial();

  aceito_1 = 0;
  aceito_2 = 0;

  $(".console-buttons").append(entrada_1 + "<br/>");
  $(".console-buttons").append(entrada_2 + "<br/>");

  verificaEntrada(entrada_1, 0, node[0], 1);
  verificaEntrada(entrada_2, 0, node[0], 2);

  if (aceito_1 == 1) $("#in-1").css("background", "green");
  else $("#in-1").css("background", "tomato");

  if (aceito_2 == 1) $("#in-2").css("background", "green");
  else $("#in-2").css("background", "tomato");
}

function verificaEntrada(entrada, index, node, input) {
  console.log("Nó atual: " + node.label);
  var corAnt = node.color != undefined ? node.color.background : undefined;
  console.log("Cor:" + corAnt);

  //Todos as ligaçoes cuja origem é o nó atual
  var egdeOfNode = edges.get({
    filter: function(item) {
      return item.from == node.id;
    }
  });

  egdeOfNode.forEach(function(item) {
    if (item.label == entrada[index]) {
      verificaEntrada(entrada, index + 1, nodes.get(item.to), input);
    }
  });

  if (index == entrada.length && node.color != undefined) {
    if (node.color.background == "#ff4d4d") {
      // aceito = 1;

      if (input == 1) aceito_1 = 1;
      else if (input == 2) aceito_2 = 1;
      console.log("Node final: " + node.label);
    } else return;
  }

  return;
}

function verificarLigacoes() {
  var edg = edges.get();
  var nd = nodes.get();

  var att = [];

  for (var i = 0; i < edg.length; i++) {
    for (var j = i + 1; j < edg.length; j++) {
      console.log("Verificando  ligaçoes: i-" + i + "    j-" + j);

      if (
        edg[i].to == edg[j].from &&
        edg[i].from == edg[j].to &&
        edg[i].id != edg[j].id
      ) {
        console.log(
          "Encontrado:  de: " +
            nd[edg[i].to].id +
            "   Para : " +
            nd[edg[i].from].id
        );

        edges.update({
          id: parseInt(edg[i].id),
          smooth: {
            enabled: true,
            type: "diagonalCross",
            roundness: 0.5
          }
        });

        edges.update({
          id: parseInt(edg[j].id),
          smooth: {
            enabled: true,
            type: "diagonalCross",
            roundness: 0.5
          }
        });

        att.push(edg[i].id, edg[j].id);
      }
    }
  }

  edges.forEach(function(elm) {
    var e = 0;
    att.forEach(function(ati) {
      if (elm.id == ati) e = 1;
    });

    if (e == 0) {
      edges.update({
        id: elm.id,
        smooth: false
      });
    }
  });
}

function zoomLabel(x) {
  x.style.fontSize = "18";
}

function zoomOut(x) {
  x.style.fontSize = "16";
}

$("#myModal").on("shown.bs.modal", function() {
  $("#myInput").trigger("focus");
});

$("document").ready(function() {
  $("#limpar").click(function() {
    nodes.clear();
    edges.clear();

    number_edges =0;
    number_nodes = 0;


  });
});
