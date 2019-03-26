const ly = 9460730472580800; // Distância em Metros que a luz leva um ano para percorrer no vácuo
const c = 299792458;        // Velocidade da luz no vácuo em Metros por Segundo
const ua = 149597870700;   // Unidade Astronômica em Metros
const segMinuto = 60;     // 1 minuto
const segHora = 3600;     // 1 hora
const segDia = 86400;     // 24 horas 
const segMes = 2629800;   // 30 dias 10 horas e 30 minutos
const segAno = 31557600;  // 365 dias e 6 horas

var tempoViagemSegundos = (d, v) => {
    let tv = ((d * ly) / v);
    return (tv === Infinity ? 0 : tv.toString().includes('NaN') ? 0 : tv);
}

var fatorLorentz = (v) => (1 / Math.pow((1 - Math.pow(v / c, 2)), 1 / 2)); //Fator de Lorentz

var fn = (n) => n < 10 ? "0" + n : n;

var app = angular.module("tempoDilata", []);
app.controller("TempoCtrl", function TempoCtrl($scope) {
    $scope.c = c;
    $scope.ly = ly;
    $scope.ua = ua;
    // Velocidade do viajante em m/s
    // Distância da viagem em anos-luz
    $scope.zerar = () => {
        let vel = $scope.v;
        let dis = $scope.d;
        $scope.v = (vel === '' ? 0 : vel);
        $scope.d = (dis === '' ? 0 : dis);
    }
    //------------------------------------
    $scope.getVR = (b, v) => {
        let r = (v / c) < 0.00000001 ? 0 : (v / c) * 100;
        return b ? parseInt(r * 100) / 100 : parseInt(r) / 100;
    }
    $scope.getFL = (v) => {
        let lz = fatorLorentz(v);
        return (lz === Infinity ? "Infinito" : lz.toString().includes('NaN') ? 'Erro' : lz.toFixed(16));
    }
    $scope.getD = (d) => {
        return (d * ly);
    }
    $scope.getUA = (d) => {
        return ((d * ly) / ua) < 0 ? parseInt(0) : parseInt((d * ly) / ua);
    }
    //--------------------
    $scope.formatarTempo = (t) => {
        //let s = t;
        let anos = (t / segAno) < 1 ? 0 : parseInt(t / segAno); t = t - (anos * segAno);
        let meses = (t / segMes) < 1 ? 0 : parseInt(t / segMes); t = t - (meses * segMes);
        let dias = (t / segDia) < 1 ? 0 : parseInt(t / segDia); t = t - (dias * segDia);
        let horas = (t / segHora) < 1 ? 0 : parseInt(t / segHora); t = t - (horas * segHora);
        let minutos = (t / segMinuto) < 1 ? 0 : parseInt(t / segMinuto); t = t - (minutos * segMinuto);
        let segundos = t < 1 ? 0 : parseInt(t); t = t - (segundos);
        let milesimos = (t * 1000) < 1 ? 0 : parseInt(t * 1000);
        anos = fn($scope.formatarNumero(anos));
        meses = fn(meses);
        dias = fn(dias);
        horas = fn(horas);
        minutos = fn(minutos);
        segundos = fn(segundos);
        milesimos = milesimos < 10 ? "00" + milesimos : milesimos < 100 ? "0" + milesimos : milesimos;
        let texto = anos + " ano" + (anos != 1 ? "s " : " ") +
            meses + " " + (meses !== 1 ? "meses " : "mês ") +
            dias + " dia" + (dias !== 1 ? "s " : " ") +
            horas + " h " +
            minutos + " min " +
            segundos + " s " +
            milesimos;
        return texto.includes("NaN") ? "Indefinido" : texto;
    }
    //--------------------
    $scope.getTT = (d, v) => {
        return (tempoViagemSegundos(d, v));
    }
    $scope.getTV = (d, v) => {
        return (tempoViagemSegundos(d, v) / fatorLorentz(v));
    }
    $scope.tempoDilatado = (d, v) => {
        return ($scope.getTT(d, v) - $scope.getTV(d, v));
    }
    $scope.formatarNumero = (numero) => {
        numero = parseInt(numero);
        let str = numero.toString();
        let res = str.substring(0, ((str.length % 3) % 3));
        for (i = 0; i < str.length; i += 3) {
            res += " " + str.substring(((str.length % 3) + i), (((str.length % 3) + 3) + i));
        }
        return res;
    }
});