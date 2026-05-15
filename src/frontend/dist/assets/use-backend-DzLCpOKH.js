var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a, _client2, _currentResult2, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn2, _b;
import { P as ProtocolError, T as TimeoutWaitingForResponseErrorCode, g as utf8ToBytes, E as ExternalError, M as MissingRootKeyErrorCode, C as Certificate, l as lookupResultToBuffer, h as RequestStatusResponseStatus, U as UnknownError, i as RequestStatusDoneNoReplyErrorCode, k as RejectError, m as CertifiedRejectErrorCode, n as UNREACHABLE_ERROR, I as InputError, p as InvalidReadStateRequestErrorCode, q as ReadRequestType, s as Principal, t as IDL, w as MissingCanisterIdErrorCode, H as HttpAgent, x as encode, Q as QueryResponseStatus, y as UncertifiedRejectErrorCode, z as isV3ResponseBody, A as isV2ResponseBody, B as UncertifiedRejectUpdateErrorCode, D as UnexpectedErrorCode, F as decode, G as Subscribable, J as pendingThenable, K as resolveEnabled, N as shallowEqualObjects, O as resolveStaleTime, V as noop, W as environmentManager, X as isValidTimeout, Y as timeUntilStale, Z as timeoutManager, _ as focusManager, $ as fetchState, a0 as replaceData, a1 as notifyManager, a2 as hashKey, a3 as getDefaultState, r as reactExports, a4 as shouldThrowError, a5 as useQueryClient, a6 as useInternetIdentity, a7 as createActorWithConfig, a8 as useRouterState, j as jsxRuntimeExports, L as Link, d as cn, a9 as Variant, aa as Record, ab as Opt, ac as Vec, ad as Service, ae as Func, af as Nat, ag as Text, ah as Bool, ai as Null, aj as Int } from "./index-DBaupoop.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a2;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a2 = agent.createReadStateRequest) == null ? void 0 : _a2.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout2 = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout2));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var MutationObserver = (_b = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client2);
    __privateAdd(this, _currentResult2);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client2, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client2).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client2).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult2);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client2).getMutationCache().build(__privateGet(this, _client2), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client2 = new WeakMap(), _currentResult2 = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult2, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn2 = function(action) {
  notifyManager.batch(() => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult2).variables;
      const onMutateResult = __privateGet(this, _currentResult2).context;
      const context = {
        client: __privateGet(this, _client2),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b2 = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b2.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult2));
    });
  });
}, _b);
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b2, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b2 = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b2.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
function hasAccessControl(actor) {
  return typeof actor === "object" && actor !== null && "_initializeAccessControl" in actor;
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2) {
  const { identity, isAuthenticated } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actorOptions = {
        agentOptions: {
          identity
        }
      };
      const actor = await createActorWithConfig(createActor2, actorOptions);
      if (hasAccessControl(actor)) {
        await actor._initializeAccessControl();
      }
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "M12 11h4", key: "1jrz19" }],
  ["path", { d: "M12 16h4", key: "n85exb" }],
  ["path", { d: "M8 11h.01", key: "1dfujw" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
];
const ClipboardList = createLucideIcon("clipboard-list", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
      key: "1a0edw"
    }
  ],
  ["path", { d: "M12 22V12", key: "d0xqtd" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }]
];
const Package = createLucideIcon("package", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2", key: "wrbu53" }],
  ["path", { d: "M15 18H9", key: "1lyqi6" }],
  [
    "path",
    {
      d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
      key: "lysw3i"
    }
  ],
  ["circle", { cx: "17", cy: "18", r: "2", key: "332jqn" }],
  ["circle", { cx: "7", cy: "18", r: "2", key: "19iecd" }]
];
const Truck = createLucideIcon("truck", __iconNode);
const NAV_ITEMS = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, exact: true },
  { label: "Products", to: "/products", icon: Package },
  { label: "Suppliers", to: "/suppliers", icon: Truck },
  { label: "Purchase Orders", to: "/purchase-orders", icon: ClipboardList }
];
const BOTTOM_NAV = [
  { label: "Settings", to: "/settings", icon: Settings }
];
function Layout({ children, title, breadcrumbs }) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  function isActive(item) {
    if (item.exact) return currentPath === item.to;
    return currentPath.startsWith(item.to);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex h-screen bg-background overflow-hidden",
      "data-ocid": "app.shell",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "aside",
          {
            className: "w-60 flex-shrink-0 flex flex-col border-r border-border",
            style: { background: "oklch(0.18 0.03 265)" },
            "data-ocid": "sidebar",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "px-4 py-4 border-b",
                  style: {
                    background: "oklch(0.56 0.18 134)",
                    borderColor: "oklch(0.48 0.16 134)"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-8 h-8 rounded flex items-center justify-center",
                        style: { background: "oklch(0.48 0.16 134)" },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-4 h-4", style: { color: "white" } })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "font-bold text-sm tracking-wider",
                          style: { color: "white" },
                          children: "StockTrack"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-[10px] tracking-wide",
                          style: { color: "oklch(0.85 0.06 134)" },
                          children: "Retail Inventory"
                        }
                      )
                    ] })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "nav",
                {
                  className: "flex-1 px-2 py-3 flex flex-col gap-0.5",
                  "aria-label": "Main navigation",
                  children: NAV_ITEMS.map((item) => {
                    const active = isActive(item);
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Link,
                      {
                        to: item.to,
                        className: cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors duration-150 group",
                          active ? "font-semibold" : "hover:opacity-90"
                        ),
                        style: active ? { background: "oklch(0.56 0.18 134)", color: "white" } : { color: "oklch(0.75 0.02 265)" },
                        "data-ocid": `nav.${item.label.toLowerCase().replace(/ /g, "-")}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            item.icon,
                            {
                              className: "w-4 h-4 flex-shrink-0",
                              "aria-hidden": "true"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 min-w-0 truncate", children: item.label }),
                          active && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            ChevronRight,
                            {
                              className: "w-3 h-3 opacity-70",
                              "aria-hidden": "true"
                            }
                          )
                        ]
                      },
                      item.to
                    );
                  })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "px-2 pb-4 border-t pt-3",
                  style: { borderColor: "oklch(0.28 0.02 265)" },
                  children: [
                    BOTTOM_NAV.map((item) => {
                      const active = isActive(item);
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Link,
                        {
                          to: item.to,
                          className: cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors duration-150",
                            active ? "font-semibold" : "hover:opacity-90"
                          ),
                          style: active ? { background: "oklch(0.56 0.18 134)", color: "white" } : { color: "oklch(0.75 0.02 265)" },
                          "data-ocid": "nav.settings",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              item.icon,
                              {
                                className: "w-4 h-4 flex-shrink-0",
                                "aria-hidden": "true"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label })
                          ]
                        },
                        item.to
                      );
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "mt-4 px-3 pt-3 border-t",
                        style: { borderColor: "oklch(0.28 0.02 265)" },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "p",
                          {
                            className: "text-[10px] leading-relaxed",
                            style: { color: "oklch(0.5 0.02 265)" },
                            children: [
                              "© ",
                              (/* @__PURE__ */ new Date()).getFullYear(),
                              " Built with love using",
                              " ",
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "a",
                                {
                                  href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                                  className: "hover:underline",
                                  style: { color: "oklch(0.7 0.1 134)" },
                                  children: "caffeine.ai"
                                }
                              )
                            ]
                          }
                        )
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "h-13 flex-shrink-0 bg-card border-b border-border flex items-center px-6 gap-3", children: breadcrumbs && breadcrumbs.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "nav",
            {
              "aria-label": "Breadcrumb",
              className: "flex items-center gap-1 text-sm",
              children: breadcrumbs.map((crumb, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3 text-muted-foreground" }),
                crumb.to ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: crumb.to,
                    className: "text-muted-foreground hover:text-foreground transition-colors",
                    children: crumb.label
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: crumb.label })
              ] }, crumb.label))
            }
          ) : title && /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-sm font-semibold text-foreground tracking-wide", children: title }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "main",
            {
              className: "flex-1 overflow-y-auto bg-background p-6",
              "data-ocid": "main.content",
              children
            }
          )
        ] })
      ]
    }
  );
}
const ProductId = Nat;
const AdjustmentType$1 = Variant({
  "remove": Null,
  "return": Null,
  "damage": Null,
  "recount": Null,
  "sale": Null,
  "receivedFromPO": Null,
  "restock": Null
});
const AdjustStockArgs = Record({
  "note": Opt(Text),
  "productId": ProductId,
  "quantity": Nat,
  "adjustmentType": AdjustmentType$1
});
const StockStatus$1 = Variant({
  "inStock": Null,
  "outOfStock": Null,
  "lowStock": Null
});
const Timestamp = Int;
const SupplierId = Nat;
const Product = Record({
  "id": ProductId,
  "sku": Text,
  "unitOfMeasure": Text,
  "lowStockThreshold": Opt(Nat),
  "stockStatus": StockStatus$1,
  "name": Text,
  "reorderQuantity": Nat,
  "sellingPrice": Nat,
  "description": Text,
  "lastModified": Timestamp,
  "barcode": Opt(Text),
  "quantity": Nat,
  "category": Text,
  "price": Nat,
  "costPrice": Nat,
  "supplierId": Opt(SupplierId)
});
const POId = Nat;
const POStatus = Variant({
  "cancelled": Null,
  "sent": Null,
  "partiallyReceived": Null,
  "draft": Null,
  "received": Null
});
const POLineItem = Record({
  "receivedQty": Nat,
  "orderedQty": Nat,
  "productSku": Text,
  "productId": ProductId,
  "productName": Text,
  "unitCostPrice": Nat
});
const PurchaseOrder = Record({
  "id": POId,
  "status": POStatus,
  "lineItems": Vec(POLineItem),
  "expectedDeliveryDate": Opt(Int),
  "supplierName": Text,
  "createdAt": Timestamp,
  "updatedAt": Timestamp,
  "totalAmount": Nat,
  "notes": Opt(Text),
  "supplierId": SupplierId
});
const CreatePOLineItemArgs = Record({
  "orderedQty": Nat,
  "productId": ProductId,
  "unitCostPrice": Nat
});
const CreatePOArgs = Record({
  "lineItems": Vec(CreatePOLineItemArgs),
  "expectedDeliveryDate": Opt(Int),
  "supplierName": Text,
  "notes": Opt(Text),
  "supplierId": SupplierId
});
const CreateProductArgs = Record({
  "sku": Text,
  "unitOfMeasure": Text,
  "lowStockThreshold": Opt(Nat),
  "name": Text,
  "reorderQuantity": Nat,
  "sellingPrice": Nat,
  "description": Text,
  "barcode": Opt(Text),
  "quantity": Nat,
  "category": Text,
  "price": Nat,
  "costPrice": Nat,
  "supplierId": Opt(SupplierId)
});
const CreateSupplierArgs = Record({
  "name": Text,
  "contactPerson": Text,
  "isActive": Bool,
  "email": Text,
  "address": Text,
  "paymentTerms": Text,
  "phone": Text
});
const Supplier = Record({
  "id": SupplierId,
  "name": Text,
  "createdAt": Timestamp,
  "contactPerson": Text,
  "isActive": Bool,
  "email": Text,
  "address": Text,
  "paymentTerms": Text,
  "phone": Text
});
const CategorySummary = Record({
  "totalValue": Nat,
  "productCount": Nat,
  "category": Text
});
const LowStockSummary = Record({
  "id": ProductId,
  "sku": Text,
  "reorderPoint": Nat,
  "name": Text,
  "currentStock": Nat
});
const DashboardMetrics = Record({
  "categories": Vec(CategorySummary),
  "totalProducts": Nat,
  "pendingPOValue": Nat,
  "totalInventoryValue": Nat,
  "pendingPOCount": Nat,
  "lowStockCount": Nat,
  "lowStockProducts": Vec(LowStockSummary)
});
const StockHistoryEntry = Record({
  "id": Nat,
  "note": Opt(Text),
  "productId": ProductId,
  "notes": Opt(Text),
  "timestamp": Timestamp,
  "quantity": Nat,
  "adjustmentType": AdjustmentType$1
});
const ReceiveItemArgs = Record({
  "receivedQty": Nat,
  "productId": ProductId
});
const SortField$1 = Variant({
  "sku": Null,
  "name": Null,
  "lastModified": Null,
  "quantity": Null,
  "price": Null
});
const SortOrder$1 = Variant({ "asc": Null, "desc": Null });
const SearchFilterArgs = Record({
  "sortField": Opt(SortField$1),
  "stockStatus": Opt(StockStatus$1),
  "sortOrder": Opt(SortOrder$1),
  "searchQuery": Opt(Text),
  "supplierId": Opt(SupplierId)
});
const UpdatePOStatusArgs = Record({
  "id": POId,
  "status": POStatus
});
const UpdateProductArgs = Record({
  "id": ProductId,
  "sku": Text,
  "unitOfMeasure": Text,
  "lowStockThreshold": Opt(Nat),
  "name": Text,
  "reorderQuantity": Nat,
  "sellingPrice": Nat,
  "description": Text,
  "barcode": Opt(Text),
  "category": Text,
  "price": Nat,
  "costPrice": Nat,
  "supplierId": Opt(SupplierId)
});
const UpdateSupplierArgs = Record({
  "name": Opt(Text),
  "contactPerson": Opt(Text),
  "isActive": Opt(Bool),
  "email": Opt(Text),
  "address": Opt(Text),
  "paymentTerms": Opt(Text),
  "phone": Opt(Text)
});
Service({
  "adjustStock": Func(
    [AdjustStockArgs],
    [Variant({ "ok": Product, "err": Text })],
    []
  ),
  "cancelPO": Func([POId], [Opt(PurchaseOrder)], []),
  "createPO": Func([CreatePOArgs], [PurchaseOrder], []),
  "createProduct": Func(
    [CreateProductArgs],
    [Variant({ "ok": Product, "err": Text })],
    []
  ),
  "createSupplier": Func([CreateSupplierArgs], [Supplier], []),
  "deleteProduct": Func(
    [ProductId],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "deleteSupplier": Func([SupplierId], [Bool], []),
  "getDashboardMetrics": Func([], [DashboardMetrics], ["query"]),
  "getGlobalLowStockThreshold": Func([], [Nat], ["query"]),
  "getPO": Func([POId], [Opt(PurchaseOrder)], ["query"]),
  "getPOsBySupplier": Func(
    [SupplierId],
    [Vec(PurchaseOrder)],
    ["query"]
  ),
  "getProduct": Func([ProductId], [Opt(Product)], ["query"]),
  "getStockHistory": Func(
    [Opt(ProductId)],
    [Vec(StockHistoryEntry)],
    ["query"]
  ),
  "getSupplier": Func([SupplierId], [Opt(Supplier)], ["query"]),
  "getSupplierProducts": Func(
    [SupplierId],
    [Vec(ProductId)],
    ["query"]
  ),
  "listPOs": Func(
    [Opt(POStatus)],
    [Vec(PurchaseOrder)],
    ["query"]
  ),
  "listProducts": Func([], [Vec(Product)], ["query"]),
  "listSuppliers": Func(
    [Opt(Bool)],
    [Vec(Supplier)],
    ["query"]
  ),
  "receivePO": Func(
    [POId, Vec(ReceiveItemArgs)],
    [Opt(PurchaseOrder)],
    []
  ),
  "searchProducts": Func(
    [SearchFilterArgs],
    [Vec(Product)],
    ["query"]
  ),
  "setGlobalLowStockThreshold": Func([Nat], [], []),
  "updatePOStatus": Func(
    [UpdatePOStatusArgs],
    [Opt(PurchaseOrder)],
    []
  ),
  "updateProduct": Func(
    [UpdateProductArgs],
    [Variant({ "ok": Product, "err": Text })],
    []
  ),
  "updateSupplier": Func(
    [SupplierId, UpdateSupplierArgs],
    [Opt(Supplier)],
    []
  )
});
const idlFactory = ({ IDL: IDL2 }) => {
  const ProductId2 = IDL2.Nat;
  const AdjustmentType2 = IDL2.Variant({
    "remove": IDL2.Null,
    "return": IDL2.Null,
    "damage": IDL2.Null,
    "recount": IDL2.Null,
    "sale": IDL2.Null,
    "receivedFromPO": IDL2.Null,
    "restock": IDL2.Null
  });
  const AdjustStockArgs2 = IDL2.Record({
    "note": IDL2.Opt(IDL2.Text),
    "productId": ProductId2,
    "quantity": IDL2.Nat,
    "adjustmentType": AdjustmentType2
  });
  const StockStatus2 = IDL2.Variant({
    "inStock": IDL2.Null,
    "outOfStock": IDL2.Null,
    "lowStock": IDL2.Null
  });
  const Timestamp2 = IDL2.Int;
  const SupplierId2 = IDL2.Nat;
  const Product2 = IDL2.Record({
    "id": ProductId2,
    "sku": IDL2.Text,
    "unitOfMeasure": IDL2.Text,
    "lowStockThreshold": IDL2.Opt(IDL2.Nat),
    "stockStatus": StockStatus2,
    "name": IDL2.Text,
    "reorderQuantity": IDL2.Nat,
    "sellingPrice": IDL2.Nat,
    "description": IDL2.Text,
    "lastModified": Timestamp2,
    "barcode": IDL2.Opt(IDL2.Text),
    "quantity": IDL2.Nat,
    "category": IDL2.Text,
    "price": IDL2.Nat,
    "costPrice": IDL2.Nat,
    "supplierId": IDL2.Opt(SupplierId2)
  });
  const POId2 = IDL2.Nat;
  const POStatus2 = IDL2.Variant({
    "cancelled": IDL2.Null,
    "sent": IDL2.Null,
    "partiallyReceived": IDL2.Null,
    "draft": IDL2.Null,
    "received": IDL2.Null
  });
  const POLineItem2 = IDL2.Record({
    "receivedQty": IDL2.Nat,
    "orderedQty": IDL2.Nat,
    "productSku": IDL2.Text,
    "productId": ProductId2,
    "productName": IDL2.Text,
    "unitCostPrice": IDL2.Nat
  });
  const PurchaseOrder2 = IDL2.Record({
    "id": POId2,
    "status": POStatus2,
    "lineItems": IDL2.Vec(POLineItem2),
    "expectedDeliveryDate": IDL2.Opt(IDL2.Int),
    "supplierName": IDL2.Text,
    "createdAt": Timestamp2,
    "updatedAt": Timestamp2,
    "totalAmount": IDL2.Nat,
    "notes": IDL2.Opt(IDL2.Text),
    "supplierId": SupplierId2
  });
  const CreatePOLineItemArgs2 = IDL2.Record({
    "orderedQty": IDL2.Nat,
    "productId": ProductId2,
    "unitCostPrice": IDL2.Nat
  });
  const CreatePOArgs2 = IDL2.Record({
    "lineItems": IDL2.Vec(CreatePOLineItemArgs2),
    "expectedDeliveryDate": IDL2.Opt(IDL2.Int),
    "supplierName": IDL2.Text,
    "notes": IDL2.Opt(IDL2.Text),
    "supplierId": SupplierId2
  });
  const CreateProductArgs2 = IDL2.Record({
    "sku": IDL2.Text,
    "unitOfMeasure": IDL2.Text,
    "lowStockThreshold": IDL2.Opt(IDL2.Nat),
    "name": IDL2.Text,
    "reorderQuantity": IDL2.Nat,
    "sellingPrice": IDL2.Nat,
    "description": IDL2.Text,
    "barcode": IDL2.Opt(IDL2.Text),
    "quantity": IDL2.Nat,
    "category": IDL2.Text,
    "price": IDL2.Nat,
    "costPrice": IDL2.Nat,
    "supplierId": IDL2.Opt(SupplierId2)
  });
  const CreateSupplierArgs2 = IDL2.Record({
    "name": IDL2.Text,
    "contactPerson": IDL2.Text,
    "isActive": IDL2.Bool,
    "email": IDL2.Text,
    "address": IDL2.Text,
    "paymentTerms": IDL2.Text,
    "phone": IDL2.Text
  });
  const Supplier2 = IDL2.Record({
    "id": SupplierId2,
    "name": IDL2.Text,
    "createdAt": Timestamp2,
    "contactPerson": IDL2.Text,
    "isActive": IDL2.Bool,
    "email": IDL2.Text,
    "address": IDL2.Text,
    "paymentTerms": IDL2.Text,
    "phone": IDL2.Text
  });
  const CategorySummary2 = IDL2.Record({
    "totalValue": IDL2.Nat,
    "productCount": IDL2.Nat,
    "category": IDL2.Text
  });
  const LowStockSummary2 = IDL2.Record({
    "id": ProductId2,
    "sku": IDL2.Text,
    "reorderPoint": IDL2.Nat,
    "name": IDL2.Text,
    "currentStock": IDL2.Nat
  });
  const DashboardMetrics2 = IDL2.Record({
    "categories": IDL2.Vec(CategorySummary2),
    "totalProducts": IDL2.Nat,
    "pendingPOValue": IDL2.Nat,
    "totalInventoryValue": IDL2.Nat,
    "pendingPOCount": IDL2.Nat,
    "lowStockCount": IDL2.Nat,
    "lowStockProducts": IDL2.Vec(LowStockSummary2)
  });
  const StockHistoryEntry2 = IDL2.Record({
    "id": IDL2.Nat,
    "note": IDL2.Opt(IDL2.Text),
    "productId": ProductId2,
    "notes": IDL2.Opt(IDL2.Text),
    "timestamp": Timestamp2,
    "quantity": IDL2.Nat,
    "adjustmentType": AdjustmentType2
  });
  const ReceiveItemArgs2 = IDL2.Record({
    "receivedQty": IDL2.Nat,
    "productId": ProductId2
  });
  const SortField2 = IDL2.Variant({
    "sku": IDL2.Null,
    "name": IDL2.Null,
    "lastModified": IDL2.Null,
    "quantity": IDL2.Null,
    "price": IDL2.Null
  });
  const SortOrder2 = IDL2.Variant({ "asc": IDL2.Null, "desc": IDL2.Null });
  const SearchFilterArgs2 = IDL2.Record({
    "sortField": IDL2.Opt(SortField2),
    "stockStatus": IDL2.Opt(StockStatus2),
    "sortOrder": IDL2.Opt(SortOrder2),
    "searchQuery": IDL2.Opt(IDL2.Text),
    "supplierId": IDL2.Opt(SupplierId2)
  });
  const UpdatePOStatusArgs2 = IDL2.Record({ "id": POId2, "status": POStatus2 });
  const UpdateProductArgs2 = IDL2.Record({
    "id": ProductId2,
    "sku": IDL2.Text,
    "unitOfMeasure": IDL2.Text,
    "lowStockThreshold": IDL2.Opt(IDL2.Nat),
    "name": IDL2.Text,
    "reorderQuantity": IDL2.Nat,
    "sellingPrice": IDL2.Nat,
    "description": IDL2.Text,
    "barcode": IDL2.Opt(IDL2.Text),
    "category": IDL2.Text,
    "price": IDL2.Nat,
    "costPrice": IDL2.Nat,
    "supplierId": IDL2.Opt(SupplierId2)
  });
  const UpdateSupplierArgs2 = IDL2.Record({
    "name": IDL2.Opt(IDL2.Text),
    "contactPerson": IDL2.Opt(IDL2.Text),
    "isActive": IDL2.Opt(IDL2.Bool),
    "email": IDL2.Opt(IDL2.Text),
    "address": IDL2.Opt(IDL2.Text),
    "paymentTerms": IDL2.Opt(IDL2.Text),
    "phone": IDL2.Opt(IDL2.Text)
  });
  return IDL2.Service({
    "adjustStock": IDL2.Func(
      [AdjustStockArgs2],
      [IDL2.Variant({ "ok": Product2, "err": IDL2.Text })],
      []
    ),
    "cancelPO": IDL2.Func([POId2], [IDL2.Opt(PurchaseOrder2)], []),
    "createPO": IDL2.Func([CreatePOArgs2], [PurchaseOrder2], []),
    "createProduct": IDL2.Func(
      [CreateProductArgs2],
      [IDL2.Variant({ "ok": Product2, "err": IDL2.Text })],
      []
    ),
    "createSupplier": IDL2.Func([CreateSupplierArgs2], [Supplier2], []),
    "deleteProduct": IDL2.Func(
      [ProductId2],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "deleteSupplier": IDL2.Func([SupplierId2], [IDL2.Bool], []),
    "getDashboardMetrics": IDL2.Func([], [DashboardMetrics2], ["query"]),
    "getGlobalLowStockThreshold": IDL2.Func([], [IDL2.Nat], ["query"]),
    "getPO": IDL2.Func([POId2], [IDL2.Opt(PurchaseOrder2)], ["query"]),
    "getPOsBySupplier": IDL2.Func(
      [SupplierId2],
      [IDL2.Vec(PurchaseOrder2)],
      ["query"]
    ),
    "getProduct": IDL2.Func([ProductId2], [IDL2.Opt(Product2)], ["query"]),
    "getStockHistory": IDL2.Func(
      [IDL2.Opt(ProductId2)],
      [IDL2.Vec(StockHistoryEntry2)],
      ["query"]
    ),
    "getSupplier": IDL2.Func([SupplierId2], [IDL2.Opt(Supplier2)], ["query"]),
    "getSupplierProducts": IDL2.Func(
      [SupplierId2],
      [IDL2.Vec(ProductId2)],
      ["query"]
    ),
    "listPOs": IDL2.Func(
      [IDL2.Opt(POStatus2)],
      [IDL2.Vec(PurchaseOrder2)],
      ["query"]
    ),
    "listProducts": IDL2.Func([], [IDL2.Vec(Product2)], ["query"]),
    "listSuppliers": IDL2.Func(
      [IDL2.Opt(IDL2.Bool)],
      [IDL2.Vec(Supplier2)],
      ["query"]
    ),
    "receivePO": IDL2.Func(
      [POId2, IDL2.Vec(ReceiveItemArgs2)],
      [IDL2.Opt(PurchaseOrder2)],
      []
    ),
    "searchProducts": IDL2.Func(
      [SearchFilterArgs2],
      [IDL2.Vec(Product2)],
      ["query"]
    ),
    "setGlobalLowStockThreshold": IDL2.Func([IDL2.Nat], [], []),
    "updatePOStatus": IDL2.Func(
      [UpdatePOStatusArgs2],
      [IDL2.Opt(PurchaseOrder2)],
      []
    ),
    "updateProduct": IDL2.Func(
      [UpdateProductArgs2],
      [IDL2.Variant({ "ok": Product2, "err": IDL2.Text })],
      []
    ),
    "updateSupplier": IDL2.Func(
      [SupplierId2, UpdateSupplierArgs2],
      [IDL2.Opt(Supplier2)],
      []
    )
  });
};
function candid_some(value) {
  return [
    value
  ];
}
function candid_none() {
  return [];
}
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
var AdjustmentType = /* @__PURE__ */ ((AdjustmentType2) => {
  AdjustmentType2["remove"] = "remove";
  AdjustmentType2["return_"] = "return";
  AdjustmentType2["damage"] = "damage";
  AdjustmentType2["recount"] = "recount";
  AdjustmentType2["sale"] = "sale";
  AdjustmentType2["receivedFromPO"] = "receivedFromPO";
  AdjustmentType2["restock"] = "restock";
  return AdjustmentType2;
})(AdjustmentType || {});
var SortField = /* @__PURE__ */ ((SortField2) => {
  SortField2["sku"] = "sku";
  SortField2["name"] = "name";
  SortField2["lastModified"] = "lastModified";
  SortField2["quantity"] = "quantity";
  SortField2["price"] = "price";
  return SortField2;
})(SortField || {});
var SortOrder = /* @__PURE__ */ ((SortOrder2) => {
  SortOrder2["asc"] = "asc";
  SortOrder2["desc"] = "desc";
  return SortOrder2;
})(SortOrder || {});
var StockStatus = /* @__PURE__ */ ((StockStatus2) => {
  StockStatus2["inStock"] = "inStock";
  StockStatus2["outOfStock"] = "outOfStock";
  StockStatus2["lowStock"] = "lowStock";
  return StockStatus2;
})(StockStatus || {});
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async adjustStock(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.adjustStock(to_candid_AdjustStockArgs_n1(this._uploadFile, this._downloadFile, arg0));
        return from_candid_variant_n5(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.adjustStock(to_candid_AdjustStockArgs_n1(this._uploadFile, this._downloadFile, arg0));
      return from_candid_variant_n5(this._uploadFile, this._downloadFile, result);
    }
  }
  async cancelPO(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.cancelPO(arg0);
        return from_candid_opt_n13(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.cancelPO(arg0);
      return from_candid_opt_n13(this._uploadFile, this._downloadFile, result);
    }
  }
  async createPO(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createPO(to_candid_CreatePOArgs_n19(this._uploadFile, this._downloadFile, arg0));
        return from_candid_PurchaseOrder_n14(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createPO(to_candid_CreatePOArgs_n19(this._uploadFile, this._downloadFile, arg0));
      return from_candid_PurchaseOrder_n14(this._uploadFile, this._downloadFile, result);
    }
  }
  async createProduct(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createProduct(to_candid_CreateProductArgs_n21(this._uploadFile, this._downloadFile, arg0));
        return from_candid_variant_n5(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createProduct(to_candid_CreateProductArgs_n21(this._uploadFile, this._downloadFile, arg0));
      return from_candid_variant_n5(this._uploadFile, this._downloadFile, result);
    }
  }
  async createSupplier(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createSupplier(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createSupplier(arg0);
      return result;
    }
  }
  async deleteProduct(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteProduct(arg0);
        return from_candid_variant_n23(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteProduct(arg0);
      return from_candid_variant_n23(this._uploadFile, this._downloadFile, result);
    }
  }
  async deleteSupplier(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteSupplier(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteSupplier(arg0);
      return result;
    }
  }
  async getDashboardMetrics() {
    if (this.processError) {
      try {
        const result = await this.actor.getDashboardMetrics();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getDashboardMetrics();
      return result;
    }
  }
  async getGlobalLowStockThreshold() {
    if (this.processError) {
      try {
        const result = await this.actor.getGlobalLowStockThreshold();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getGlobalLowStockThreshold();
      return result;
    }
  }
  async getPO(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getPO(arg0);
        return from_candid_opt_n13(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getPO(arg0);
      return from_candid_opt_n13(this._uploadFile, this._downloadFile, result);
    }
  }
  async getPOsBySupplier(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getPOsBySupplier(arg0);
        return from_candid_vec_n24(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getPOsBySupplier(arg0);
      return from_candid_vec_n24(this._uploadFile, this._downloadFile, result);
    }
  }
  async getProduct(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getProduct(arg0);
        return from_candid_opt_n25(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getProduct(arg0);
      return from_candid_opt_n25(this._uploadFile, this._downloadFile, result);
    }
  }
  async getStockHistory(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getStockHistory(to_candid_opt_n26(this._uploadFile, this._downloadFile, arg0));
        return from_candid_vec_n27(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getStockHistory(to_candid_opt_n26(this._uploadFile, this._downloadFile, arg0));
      return from_candid_vec_n27(this._uploadFile, this._downloadFile, result);
    }
  }
  async getSupplier(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getSupplier(arg0);
        return from_candid_opt_n32(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getSupplier(arg0);
      return from_candid_opt_n32(this._uploadFile, this._downloadFile, result);
    }
  }
  async getSupplierProducts(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getSupplierProducts(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getSupplierProducts(arg0);
      return result;
    }
  }
  async listPOs(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.listPOs(to_candid_opt_n33(this._uploadFile, this._downloadFile, arg0));
        return from_candid_vec_n24(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listPOs(to_candid_opt_n33(this._uploadFile, this._downloadFile, arg0));
      return from_candid_vec_n24(this._uploadFile, this._downloadFile, result);
    }
  }
  async listProducts() {
    if (this.processError) {
      try {
        const result = await this.actor.listProducts();
        return from_candid_vec_n36(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listProducts();
      return from_candid_vec_n36(this._uploadFile, this._downloadFile, result);
    }
  }
  async listSuppliers(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.listSuppliers(to_candid_opt_n37(this._uploadFile, this._downloadFile, arg0));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listSuppliers(to_candid_opt_n37(this._uploadFile, this._downloadFile, arg0));
      return result;
    }
  }
  async receivePO(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.receivePO(arg0, arg1);
        return from_candid_opt_n13(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.receivePO(arg0, arg1);
      return from_candid_opt_n13(this._uploadFile, this._downloadFile, result);
    }
  }
  async searchProducts(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.searchProducts(to_candid_SearchFilterArgs_n38(this._uploadFile, this._downloadFile, arg0));
        return from_candid_vec_n36(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.searchProducts(to_candid_SearchFilterArgs_n38(this._uploadFile, this._downloadFile, arg0));
      return from_candid_vec_n36(this._uploadFile, this._downloadFile, result);
    }
  }
  async setGlobalLowStockThreshold(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.setGlobalLowStockThreshold(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.setGlobalLowStockThreshold(arg0);
      return result;
    }
  }
  async updatePOStatus(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updatePOStatus(to_candid_UpdatePOStatusArgs_n46(this._uploadFile, this._downloadFile, arg0));
        return from_candid_opt_n13(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updatePOStatus(to_candid_UpdatePOStatusArgs_n46(this._uploadFile, this._downloadFile, arg0));
      return from_candid_opt_n13(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateProduct(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateProduct(to_candid_UpdateProductArgs_n48(this._uploadFile, this._downloadFile, arg0));
        return from_candid_variant_n5(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateProduct(to_candid_UpdateProductArgs_n48(this._uploadFile, this._downloadFile, arg0));
      return from_candid_variant_n5(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateSupplier(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateSupplier(arg0, to_candid_UpdateSupplierArgs_n50(this._uploadFile, this._downloadFile, arg1));
        return from_candid_opt_n32(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateSupplier(arg0, to_candid_UpdateSupplierArgs_n50(this._uploadFile, this._downloadFile, arg1));
      return from_candid_opt_n32(this._uploadFile, this._downloadFile, result);
    }
  }
}
function from_candid_AdjustmentType_n30(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n31(_uploadFile, _downloadFile, value);
}
function from_candid_POStatus_n16(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n17(_uploadFile, _downloadFile, value);
}
function from_candid_Product_n6(_uploadFile, _downloadFile, value) {
  return from_candid_record_n7(_uploadFile, _downloadFile, value);
}
function from_candid_PurchaseOrder_n14(_uploadFile, _downloadFile, value) {
  return from_candid_record_n15(_uploadFile, _downloadFile, value);
}
function from_candid_StockHistoryEntry_n28(_uploadFile, _downloadFile, value) {
  return from_candid_record_n29(_uploadFile, _downloadFile, value);
}
function from_candid_StockStatus_n9(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n10(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n11(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n12(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n13(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_PurchaseOrder_n14(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n18(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n25(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_Product_n6(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n32(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n8(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_record_n15(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_POStatus_n16(_uploadFile, _downloadFile, value.status),
    lineItems: value.lineItems,
    expectedDeliveryDate: record_opt_to_undefined(from_candid_opt_n18(_uploadFile, _downloadFile, value.expectedDeliveryDate)),
    supplierName: value.supplierName,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
    totalAmount: value.totalAmount,
    notes: record_opt_to_undefined(from_candid_opt_n11(_uploadFile, _downloadFile, value.notes)),
    supplierId: value.supplierId
  };
}
function from_candid_record_n29(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    note: record_opt_to_undefined(from_candid_opt_n11(_uploadFile, _downloadFile, value.note)),
    productId: value.productId,
    notes: record_opt_to_undefined(from_candid_opt_n11(_uploadFile, _downloadFile, value.notes)),
    timestamp: value.timestamp,
    quantity: value.quantity,
    adjustmentType: from_candid_AdjustmentType_n30(_uploadFile, _downloadFile, value.adjustmentType)
  };
}
function from_candid_record_n7(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    sku: value.sku,
    unitOfMeasure: value.unitOfMeasure,
    lowStockThreshold: record_opt_to_undefined(from_candid_opt_n8(_uploadFile, _downloadFile, value.lowStockThreshold)),
    stockStatus: from_candid_StockStatus_n9(_uploadFile, _downloadFile, value.stockStatus),
    name: value.name,
    reorderQuantity: value.reorderQuantity,
    sellingPrice: value.sellingPrice,
    description: value.description,
    lastModified: value.lastModified,
    barcode: record_opt_to_undefined(from_candid_opt_n11(_uploadFile, _downloadFile, value.barcode)),
    quantity: value.quantity,
    category: value.category,
    price: value.price,
    costPrice: value.costPrice,
    supplierId: record_opt_to_undefined(from_candid_opt_n12(_uploadFile, _downloadFile, value.supplierId))
  };
}
function from_candid_variant_n10(_uploadFile, _downloadFile, value) {
  return "inStock" in value ? "inStock" : "outOfStock" in value ? "outOfStock" : "lowStock" in value ? "lowStock" : value;
}
function from_candid_variant_n17(_uploadFile, _downloadFile, value) {
  return "cancelled" in value ? "cancelled" : "sent" in value ? "sent" : "partiallyReceived" in value ? "partiallyReceived" : "draft" in value ? "draft" : "received" in value ? "received" : value;
}
function from_candid_variant_n23(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n31(_uploadFile, _downloadFile, value) {
  return "remove" in value ? "remove" : "return" in value ? AdjustmentType.return : "damage" in value ? "damage" : "recount" in value ? "recount" : "sale" in value ? "sale" : "receivedFromPO" in value ? "receivedFromPO" : "restock" in value ? "restock" : value;
}
function from_candid_variant_n5(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_Product_n6(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_vec_n24(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_PurchaseOrder_n14(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n27(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_StockHistoryEntry_n28(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n36(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Product_n6(_uploadFile, _downloadFile, x));
}
function to_candid_AdjustStockArgs_n1(_uploadFile, _downloadFile, value) {
  return to_candid_record_n2(_uploadFile, _downloadFile, value);
}
function to_candid_AdjustmentType_n3(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n4(_uploadFile, _downloadFile, value);
}
function to_candid_CreatePOArgs_n19(_uploadFile, _downloadFile, value) {
  return to_candid_record_n20(_uploadFile, _downloadFile, value);
}
function to_candid_CreateProductArgs_n21(_uploadFile, _downloadFile, value) {
  return to_candid_record_n22(_uploadFile, _downloadFile, value);
}
function to_candid_POStatus_n34(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n35(_uploadFile, _downloadFile, value);
}
function to_candid_SearchFilterArgs_n38(_uploadFile, _downloadFile, value) {
  return to_candid_record_n39(_uploadFile, _downloadFile, value);
}
function to_candid_SortField_n40(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n41(_uploadFile, _downloadFile, value);
}
function to_candid_SortOrder_n44(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n45(_uploadFile, _downloadFile, value);
}
function to_candid_StockStatus_n42(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n43(_uploadFile, _downloadFile, value);
}
function to_candid_UpdatePOStatusArgs_n46(_uploadFile, _downloadFile, value) {
  return to_candid_record_n47(_uploadFile, _downloadFile, value);
}
function to_candid_UpdateProductArgs_n48(_uploadFile, _downloadFile, value) {
  return to_candid_record_n49(_uploadFile, _downloadFile, value);
}
function to_candid_UpdateSupplierArgs_n50(_uploadFile, _downloadFile, value) {
  return to_candid_record_n51(_uploadFile, _downloadFile, value);
}
function to_candid_opt_n26(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function to_candid_opt_n33(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(to_candid_POStatus_n34(_uploadFile, _downloadFile, value));
}
function to_candid_opt_n37(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function to_candid_record_n2(_uploadFile, _downloadFile, value) {
  return {
    note: value.note ? candid_some(value.note) : candid_none(),
    productId: value.productId,
    quantity: value.quantity,
    adjustmentType: to_candid_AdjustmentType_n3(_uploadFile, _downloadFile, value.adjustmentType)
  };
}
function to_candid_record_n20(_uploadFile, _downloadFile, value) {
  return {
    lineItems: value.lineItems,
    expectedDeliveryDate: value.expectedDeliveryDate ? candid_some(value.expectedDeliveryDate) : candid_none(),
    supplierName: value.supplierName,
    notes: value.notes ? candid_some(value.notes) : candid_none(),
    supplierId: value.supplierId
  };
}
function to_candid_record_n22(_uploadFile, _downloadFile, value) {
  return {
    sku: value.sku,
    unitOfMeasure: value.unitOfMeasure,
    lowStockThreshold: value.lowStockThreshold ? candid_some(value.lowStockThreshold) : candid_none(),
    name: value.name,
    reorderQuantity: value.reorderQuantity,
    sellingPrice: value.sellingPrice,
    description: value.description,
    barcode: value.barcode ? candid_some(value.barcode) : candid_none(),
    quantity: value.quantity,
    category: value.category,
    price: value.price,
    costPrice: value.costPrice,
    supplierId: value.supplierId ? candid_some(value.supplierId) : candid_none()
  };
}
function to_candid_record_n39(_uploadFile, _downloadFile, value) {
  return {
    sortField: value.sortField ? candid_some(to_candid_SortField_n40(_uploadFile, _downloadFile, value.sortField)) : candid_none(),
    stockStatus: value.stockStatus ? candid_some(to_candid_StockStatus_n42(_uploadFile, _downloadFile, value.stockStatus)) : candid_none(),
    sortOrder: value.sortOrder ? candid_some(to_candid_SortOrder_n44(_uploadFile, _downloadFile, value.sortOrder)) : candid_none(),
    searchQuery: value.searchQuery ? candid_some(value.searchQuery) : candid_none(),
    supplierId: value.supplierId ? candid_some(value.supplierId) : candid_none()
  };
}
function to_candid_record_n47(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: to_candid_POStatus_n34(_uploadFile, _downloadFile, value.status)
  };
}
function to_candid_record_n49(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    sku: value.sku,
    unitOfMeasure: value.unitOfMeasure,
    lowStockThreshold: value.lowStockThreshold ? candid_some(value.lowStockThreshold) : candid_none(),
    name: value.name,
    reorderQuantity: value.reorderQuantity,
    sellingPrice: value.sellingPrice,
    description: value.description,
    barcode: value.barcode ? candid_some(value.barcode) : candid_none(),
    category: value.category,
    price: value.price,
    costPrice: value.costPrice,
    supplierId: value.supplierId ? candid_some(value.supplierId) : candid_none()
  };
}
function to_candid_record_n51(_uploadFile, _downloadFile, value) {
  return {
    name: value.name ? candid_some(value.name) : candid_none(),
    contactPerson: value.contactPerson ? candid_some(value.contactPerson) : candid_none(),
    isActive: value.isActive ? candid_some(value.isActive) : candid_none(),
    email: value.email ? candid_some(value.email) : candid_none(),
    address: value.address ? candid_some(value.address) : candid_none(),
    paymentTerms: value.paymentTerms ? candid_some(value.paymentTerms) : candid_none(),
    phone: value.phone ? candid_some(value.phone) : candid_none()
  };
}
function to_candid_variant_n35(_uploadFile, _downloadFile, value) {
  return value == "cancelled" ? {
    cancelled: null
  } : value == "sent" ? {
    sent: null
  } : value == "partiallyReceived" ? {
    partiallyReceived: null
  } : value == "draft" ? {
    draft: null
  } : value == "received" ? {
    received: null
  } : value;
}
function to_candid_variant_n4(_uploadFile, _downloadFile, value) {
  return value == "remove" ? {
    remove: null
  } : value == AdjustmentType.return ? {
    return_: null
  } : value == "damage" ? {
    damage: null
  } : value == "recount" ? {
    recount: null
  } : value == "sale" ? {
    sale: null
  } : value == "receivedFromPO" ? {
    receivedFromPO: null
  } : value == "restock" ? {
    restock: null
  } : value;
}
function to_candid_variant_n41(_uploadFile, _downloadFile, value) {
  return value == "sku" ? {
    sku: null
  } : value == "name" ? {
    name: null
  } : value == "lastModified" ? {
    lastModified: null
  } : value == "quantity" ? {
    quantity: null
  } : value == "price" ? {
    price: null
  } : value;
}
function to_candid_variant_n43(_uploadFile, _downloadFile, value) {
  return value == "inStock" ? {
    inStock: null
  } : value == "outOfStock" ? {
    outOfStock: null
  } : value == "lowStock" ? {
    lowStock: null
  } : value;
}
function to_candid_variant_n45(_uploadFile, _downloadFile, value) {
  return value == "asc" ? {
    asc: null
  } : value == "desc" ? {
    desc: null
  } : value;
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
function useDashboardMetrics() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["dashboardMetrics"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getDashboardMetrics();
    },
    enabled: !!actor && !isFetching
  });
}
function useListProducts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProducts();
    },
    enabled: !!actor && !isFetching
  });
}
function useSearchProducts(args) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["products", "search", args],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchProducts(args);
    },
    enabled: !!actor && !isFetching
  });
}
function useGetProduct(id) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["product", id == null ? void 0 : id.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && id !== null
  });
}
function useStockHistory(productId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["stockHistory", productId == null ? void 0 : productId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStockHistory(productId);
    },
    enabled: !!actor && !isFetching
  });
}
function useGlobalLowStockThreshold() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["globalLowStockThreshold"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getGlobalLowStockThreshold();
    },
    enabled: !!actor && !isFetching
  });
}
function useCreateProduct() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.createProduct(args);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    }
  });
}
function useUpdateProduct() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.updateProduct(args);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product", vars.id.toString()] });
      qc.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    }
  });
}
function useDeleteProduct() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.deleteProduct(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    }
  });
}
function useAdjustStock() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.adjustStock(args);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({
        queryKey: ["product", vars.productId.toString()]
      });
      qc.invalidateQueries({
        queryKey: ["stockHistory", vars.productId.toString()]
      });
      qc.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    }
  });
}
function useSetGlobalLowStockThreshold() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (threshold) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.setGlobalLowStockThreshold(threshold);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["globalLowStockThreshold"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    }
  });
}
function useListSuppliers(isActiveFilter = null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["suppliers", isActiveFilter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSuppliers(isActiveFilter);
    },
    enabled: !!actor && !isFetching
  });
}
function useGetSupplier(id) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["supplier", id == null ? void 0 : id.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getSupplier(id);
    },
    enabled: !!actor && !isFetching && id !== null
  });
}
function useCreateSupplier() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createSupplier(args);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["suppliers"] });
    }
  });
}
function useUpdateSupplier() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      args
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateSupplier(id, args);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["suppliers"] });
      qc.invalidateQueries({ queryKey: ["supplier", vars.id.toString()] });
    }
  });
}
function useDeleteSupplier() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteSupplier(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["suppliers"] });
    }
  });
}
function useListPOs(statusFilter = null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["purchaseOrders", statusFilter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPOs(statusFilter);
    },
    enabled: !!actor && !isFetching
  });
}
function useGetPO(id) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["purchaseOrder", id == null ? void 0 : id.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getPO(id);
    },
    enabled: !!actor && !isFetching && id !== null
  });
}
function useCreatePO() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createPO(args);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchaseOrders"] });
      qc.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    }
  });
}
function useUpdatePOStatus() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updatePOStatus({ id, status });
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["purchaseOrders"] });
      qc.invalidateQueries({ queryKey: ["purchaseOrder", vars.id.toString()] });
      qc.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    }
  });
}
function useReceivePO() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      receivedItems
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.receivePO(id, receivedItems);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["purchaseOrders"] });
      qc.invalidateQueries({ queryKey: ["purchaseOrder", vars.id.toString()] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    }
  });
}
function useCancelPO() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.cancelPO(id);
    },
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ["purchaseOrders"] });
      qc.invalidateQueries({ queryKey: ["purchaseOrder", id.toString()] });
      qc.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    }
  });
}
function useGetSupplierProducts(supplierId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["supplierProducts", supplierId == null ? void 0 : supplierId.toString()],
    queryFn: async () => {
      if (!actor || supplierId === null) return [];
      return actor.getSupplierProducts(supplierId);
    },
    enabled: !!actor && !isFetching && supplierId !== null
  });
}
function useGetPOsBySupplier(supplierId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["supplierPOs", supplierId == null ? void 0 : supplierId.toString()],
    queryFn: async () => {
      if (!actor || supplierId === null) return [];
      return actor.getPOsBySupplier(supplierId);
    },
    enabled: !!actor && !isFetching && supplierId !== null
  });
}
export {
  AdjustmentType as A,
  useUpdatePOStatus as B,
  ClipboardList as C,
  useReceivePO as D,
  Layout as L,
  Package as P,
  StockStatus as S,
  Truck as T,
  useListSuppliers as a,
  ChevronRight as b,
  createLucideIcon as c,
  useSearchProducts as d,
  useDeleteProduct as e,
  SortField as f,
  SortOrder as g,
  useGetProduct as h,
  useStockHistory as i,
  useAdjustStock as j,
  useGetSupplier as k,
  useCreateProduct as l,
  useUpdateProduct as m,
  useGlobalLowStockThreshold as n,
  useSetGlobalLowStockThreshold as o,
  useUpdateSupplier as p,
  useDeleteSupplier as q,
  useCreateSupplier as r,
  useGetSupplierProducts as s,
  useListProducts as t,
  useDashboardMetrics as u,
  useGetPOsBySupplier as v,
  useListPOs as w,
  useCancelPO as x,
  useCreatePO as y,
  useGetPO as z
};
