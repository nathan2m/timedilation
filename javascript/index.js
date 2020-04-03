const ID = id => document.getElementById(id);

const lang = {
    "pt": {
        trv: "Tempo real de viagem",
        tvv: "Tempo de viagem para o viajante",
        dt: "Dilatação do tempo",
        v: "Velocidade",
        vl: "da velocidade da luz",
        dv: "Distância da viagem",
        d: "Distância",
        al: "anos-luz",
        ua: "UA",
        UA: "Unidade Astronômica",
        fl: "Fator de Lorentz",
        as: "anos",
        a: "ano",
        ms: "meses",
        m: "mês",
        ds: "dias",
        da: "dia",
        inf: "Infinito",
        e: "Erro",
        ind: "Indefinido",
    },
    "en": {
        trv: "Travel's true time elapsed",
        tvv: "Travel's time elapsed for traveler",
        dt: "Time dilation",
        v: "Speed",
        vl: "of light speed",
        dv: "Travel distance",
        d: "Distance",
        al: "light-years",
        ua: "AU",
        UA: "Astronomical Unit",
        fl: "Lorentz factor",
        as: "years",
        a: "year",
        ms: "months",
        m: "month",
        ds: "days",
        da: "day",
        inf: "Infinite",
        e: "Error",
        ind: "Undefined",
    },
    "fr": {
        trv: "Temps réel du voyage",
        tvv: "Temps du voyage pour le voyageur",
        dt: "Dilatation du temps",
        v: "Vitesse",
        vl: "de la vitesse de la lumière",
        dv: "Distance du voyage",
        d: "Distance",
        al: "années-lumière",
        ua: "UA",
        UA: "Unité Astronomique",
        fl: "Facteur de Lorentz",
        as: "ans",
        a: "an",
        ms: "mois",
        m: "mois",
        ds: "jours",
        da: "jour",
        inf: "Infini",
        e: "Erreur",
        ind: "Indéfini",
    },
};

let al = "pt";

const ly = 9460730472580800; // Distância em Metros que a luz leva um ano para percorrer no vácuo
const c = 299792458;        // Velocidade da luz no vácuo em Metros por Segundo
const ua = 149597870700;   // Unidade Astronômica em Metros
const segMinuto = 60;     // 1 minuto
const segHora = 3600;     // 1 hora
const segDia = 86400;     // 24 horas 
const segMes = 2629800;   // 30 dias 10 horas e 30 minutos
const segAno = 31557600;  // 365 dias e 6 horas

const tempoViagemSegundos = (d, v) => {
    let tv = ((d * ly) / v);
    return (tv === Infinity ? 0 : tv.toString().includes('NaN') ? 0 : tv);
}

const fatorLorentz = v => (1 / Math.pow((1 - Math.pow(v / c, 2)), 1 / 2)); //Fator de Lorentz

const fn = n => n < 10 ? "0" + n : n;

var app = angular.module("tempoDilata", []);
app.controller("TempoCtrl", function TempoCtrl($scope) {
    $scope.c = c;
    $scope.ly = ly;
    $scope.ua = ua;

    $scope.setLang = l => { $scope.lang = lang[l]; al = l; ID("titleHead").innerHTML = $scope.lang.dt; };

    $scope.lang = lang[al];
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
    $scope.getFL = v => {
        let lz = fatorLorentz(v);
        return (lz === Infinity ? lang[al].inf : lz.toString().includes('NaN') ? lang[al].e : lz.toFixed(16));
    }
    $scope.getD = d => (d * ly);

    $scope.getUA = d => ((d * ly) / ua) < 0 ? parseInt(0) : parseInt((d * ly) / ua);

    //--------------------
    $scope.formatarTempo = t => {
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
        let texto = "";
        if (parseInt(anos) > 0) texto += anos + " " + (anos !== "01 " ? lang[al].as : lang[al].a) + " ";
        if (parseInt(meses) > 0) texto += meses + " " + (meses !== "01" ? lang[al].ms : lang[al].m) + " ";
        if (parseInt(dias) > 0) texto += dias + " " + (dias !== "01" ? lang[al].ds : lang[al].da) + " ";
        texto += (texto !== "" ? " | " : "") + horas + " h " +
            minutos + " min " +
            segundos + " s " +
            milesimos;
        return texto.includes("NaN") ? lang[al].ind : texto;
    }
    //--------------------
    $scope.getTT = (d, v) => tempoViagemSegundos(d, v);

    $scope.getTV = (d, v) => tempoViagemSegundos(d, v) / fatorLorentz(v);

    $scope.tempoDilatado = (d, v) => $scope.getTT(d, v) - $scope.getTV(d, v);

    $scope.formatarNumero = numero => {
        numero = parseInt(numero);
        let str = numero.toString();
        let res = str.substring(0, ((str.length % 3) % 3));
        for (i = 0; i < str.length; i += 3) {
            res += " " + str.substring(((str.length % 3) + i), (((str.length % 3) + 3) + i));
        }
        return res;
    }
});