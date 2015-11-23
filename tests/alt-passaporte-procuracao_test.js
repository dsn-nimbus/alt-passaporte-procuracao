"use strict";

describe('alt.passaporte-procuracao', function() {
  var _rootScope, _q, _httpBackend, _AltPassaporteProcuracaoService, _AltPassaporteAuthorizationInfoService, _AltPassaporteProcuracaoURL;
  var _provider;
  var URL_BASE = 'http://abc.com'
  var URL_COMPLETA_SEM_QS = URL_BASE + '/passaporte-rest-api/rest/authorization/procuracao';

  beforeEach(module('alt.passaporte-procuracao', function(AltPassaporteProcuracaoURLProvider) {
    AltPassaporteProcuracaoURLProvider.url = URL_BASE;
    _provider = AltPassaporteProcuracaoURLProvider;
  }));

  beforeEach(inject(function($injector) {
    _httpBackend = $injector.get('$httpBackend');
    _rootScope = $injector.get('$rootScope');
    _q = $injector.get('$q');
    _AltPassaporteAuthorizationInfoService = $injector.get('AltPassaporteAuthorizationInfoService');
    _AltPassaporteProcuracaoService = $injector.get('AltPassaporteProcuracaoService');
    _AltPassaporteProcuracaoURL = $injector.get('AltPassaporteProcuracaoURL');
  }));

  describe('criação', function() {
    it('deve ter o valor correto para o provider', function() {
      expect(_AltPassaporteProcuracaoURL).toEqual(URL_BASE);
    });

    it('deve ter o retorno correto', function() {
      expect(typeof _AltPassaporteProcuracaoService).toBe('object');
    });

    it('deve ter _altPassaporteAuthorizationInfoService como uma instancia de AltPassaporteAuthorizationInfoService', function() {
      expect(_AltPassaporteProcuracaoService._altPassaporteAuthorizationInfoService instanceof _AltPassaporteAuthorizationInfoService).toBe(true);
    });
  });

  describe('getInfo', function() {
    it('deve tentar buscar as informacoes, mas busca do token retorna erro', function() {
      spyOn(_AltPassaporteProcuracaoService._altPassaporteAuthorizationInfoService, 'getToken').and.callFake(function() {
        return _q.reject({erro: 1});
      });

      _AltPassaporteProcuracaoService
        .getInfo()
        .then(function() {
          expect(true).toBe(false);
        })
        .catch(function(erro) {
          expect(erro).toBeDefined;
        });

      _rootScope.$digest();
    });

    it('deve tentar buscar as informacoes, mas a procuracao retorna erro', function() {
      var _token = 'abc123';

      spyOn(_AltPassaporteProcuracaoService._altPassaporteAuthorizationInfoService, 'getToken').and.callFake(function() {
        return _q.when(_token);
      });

      spyOn(_AltPassaporteProcuracaoService, '_fazProcuracao').and.callFake(function() {
        return _q.reject({erro: 1});
      });

      _AltPassaporteProcuracaoService
        .getInfo()
        .then(function() {
          expect(true).toBe(false);
        })
        .catch(function(erro) {
          expect(erro).toBeDefined;
        });

      _rootScope.$digest();
    });

    it('deve buscar as informacoes corretamente', function() {
      var _token = 'abc123';
      var _usuario = {a: true, b: false, c: 1};

      spyOn(_AltPassaporteProcuracaoService._altPassaporteAuthorizationInfoService, 'getToken').and.callFake(function() {
        return _q.when(_token);
      });

      spyOn(_AltPassaporteProcuracaoService, '_fazProcuracao').and.callFake(function() {
        return _q.when(_usuario);
      });

      _AltPassaporteProcuracaoService
        .getInfo()
        .then(function(u) {
          expect(u).toEqual(_usuario);
        })
        .catch(function(erro) {
          expect(erro).toBeDefined;
        });

      _rootScope.$digest();
    });
  });

  describe('_fazProcuracao', function() {
    it('não deve fazer a busca, token não informado', function() {
      var _token = undefined;
      var _idAssinante = 1;
      var _idProdutoProcurador = 2;
      var _idProdutoOutorgante = 3;

      _AltPassaporteProcuracaoService
        ._fazProcuracao(_token, _idAssinante, _idProdutoProcurador, _idProdutoOutorgante)
        .then(function() {
          expect(true).toBe(false);
        })
        .catch(function(erro) {
          expect(erro).toBeDefined();
          expect(erro instanceof TypeError).toBe(true);
          expect(erro.message).toBe('Token não informado para fazer a procuração.');
        });

      _rootScope.$digest();
    });

    it('não deve fazer a busca, idAssinante não informado', function() {
      var _token = 1;
      var _idAssinante = undefined;
      var _idProdutoProcurador = 2;
      var _idProdutoOutorgante = 3;

      _AltPassaporteProcuracaoService
        ._fazProcuracao(_token, _idAssinante, _idProdutoProcurador, _idProdutoOutorgante)
        .then(function() {
          expect(true).toBe(false);
        })
        .catch(function(erro) {
          expect(erro).toBeDefined();
          expect(erro instanceof TypeError).toBe(true);
          expect(erro.message).toBe('Id do assinante não informado para fazer a procuração.');
        });

      _rootScope.$digest();
    });

    it('não deve fazer a busca, idProdutoProcurador não informado', function() {
      var _token = 1;
      var _idAssinante = 2;
      var _idProdutoProcurador = undefined;
      var _idProdutoOutorgante = 3;

      _AltPassaporteProcuracaoService
        ._fazProcuracao(_token, _idAssinante, _idProdutoProcurador, _idProdutoOutorgante)
        .then(function() {
          expect(true).toBe(false);
        })
        .catch(function(erro) {
          expect(erro).toBeDefined();
          expect(erro instanceof TypeError).toBe(true);
          expect(erro.message).toBe('Id do produto procurador não informado para fazer a procuração.');
        });

      _rootScope.$digest();
    });

    it('não deve fazer a busca, idProdutoOutorgante não informado', function() {
      var _token = 1;
      var _idAssinante = 2;
      var _idProdutoProcurador = 3;
      var _idProdutoOutorgante = undefined;

      _AltPassaporteProcuracaoService
        ._fazProcuracao(_token, _idAssinante, _idProdutoProcurador, _idProdutoOutorgante)
        .then(function() {
          expect(true).toBe(false);
        })
        .catch(function(erro) {
          expect(erro).toBeDefined();
          expect(erro instanceof TypeError).toBe(true);
          expect(erro.message).toBe('Id do produto outorgante não informado para fazer a procuração.');
        });

      _rootScope.$digest();
    });

    it('deve tentar fazer a busca, mas servidor retorna erro', function() {
      var _token = 1;
      var _idAssinante = 2;
      var _idProdutoProcurador = 3;
      var _idProdutoOutorgante = 4;

      var _url = URL_COMPLETA_SEM_QS + '?token=1&idAssinante=2&idProdutoProcurador=3&idProdutoOutorgante=4';

      _httpBackend.expectGET(_url).respond(400, {erro: 1});

      _AltPassaporteProcuracaoService
        ._fazProcuracao(_token, _idAssinante, _idProdutoProcurador, _idProdutoOutorgante)
        .then(function() {
          expect(true).toBe(false);
        })
        .catch(function(erro) {
          expect(erro).toBeDefined();
        });

      _httpBackend.flush();
    })

    it('deve fazer a busca corretamente', function() {
      var _token = 1;
      var _idAssinante = 2;
      var _idProdutoProcurador = 3;
      var _idProdutoOutorgante = 4;
      var _usuarioResposta = {a: true};

      var _url = URL_COMPLETA_SEM_QS + '?token=1&idAssinante=2&idProdutoProcurador=3&idProdutoOutorgante=4';

      _httpBackend.expectGET(_url).respond(200, _usuarioResposta);

      _AltPassaporteProcuracaoService
        ._fazProcuracao(_token, _idAssinante, _idProdutoProcurador, _idProdutoOutorgante)
        .then(function(usuario) {
          expect(usuario).toEqual(_usuarioResposta);
        })
        .catch(function(erro) {
          expect(true).toBe(false);
        });

      _httpBackend.flush();
    })
  });
});
