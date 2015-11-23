;(function(ng) {
  "use strict";

  var ENDPOINT_PASSAPORTE = '/passaporte-rest-api/rest/authorization/procuracao';

  //authorization/procuracao?token=lll&idAssinante=kkk&idProdutoProcurador=xxx&idProdutoOutorgante=ppp

  ng.module('alt.passaporte-procuracao', ['alt.passaporte-informacoes-autorizacao'])
    .config(['$httpProvider', function($httpProvider) {
      $httpProvider.defaults.withCredentials = true;
    }])
    .provider('AltPassaporteProcuracaoURL', function() {
      this.url = '';

      this.$get = function() {
        return this.url;
      };
    })
    .service('AltPassaporteProcuracaoService', ['$http', '$q', 'AltPassaporteProcuracaoURL', 'AltPassaporteAuthorizationInfoService', function($http, $q, AltPassaporteProcuracaoURL, AltPassaporteAuthorizationInfoService) {
      var URL_COMPLETA = AltPassaporteProcuracaoURL + ENDPOINT_PASSAPORTE;

      this._altPassaporteAuthorizationInfoService = new AltPassaporteAuthorizationInfoService(AltPassaporteProcuracaoURL);

      this._fazProcuracao = function(token, idAssinante, idProdutoProcurador, idProdutoOutorgante) {
        if (ng.isUndefined(token)) {
            return $q.reject(new TypeError('Token não informado para fazer a procuração.'));
        }

        if (ng.isUndefined(idAssinante)) {
            return $q.reject(new TypeError('Id do assinante não informado para fazer a procuração.'));
        }

        if (ng.isUndefined(idProdutoProcurador)) {
            return $q.reject(new TypeError('Id do produto procurador não informado para fazer a procuração.'));
        }

        if (ng.isUndefined(idProdutoOutorgante)) {
            return $q.reject(new TypeError('Id do produto outorgante não informado para fazer a procuração.'));
        }

        var _queryString = '?token=' + token + '&idAssinante=' + idAssinante +
                           '&idProdutoProcurador=' + idProdutoProcurador + '&idProdutoOutorgante=' + idProdutoOutorgante;

        var _url = URL_COMPLETA + _queryString;

        return $http.get(_url)
                    .then(function(info) {
                      return info.data;
                    });
      };

      this.getInfo = function(idAssinante, idProdutoProcurador, idProdutoOutorgante) {
        var self = this;

        return this._altPassaporteAuthorizationInfoService.getToken()
                   .then(function(token) {
                      return self._fazProcuracao(token, idAssinante, idProdutoProcurador, idProdutoOutorgante);
                   })
                   .then(function(usuario) {
                     return usuario;
                   })
                   .catch(function(erro) {
                     return $q.reject(erro);
                   });
      };
    }]);
}(angular));
