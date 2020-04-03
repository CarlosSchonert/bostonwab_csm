/**
 * Copyright @ 2019 Esri.
 * All rights reserved under the copyright laws of the United States and applicable international laws, treaties, and conventions.
 */
define(["dojo/_base/lang","esri/core/has","dojo/_base/array","dojo/Deferred","esri/core/declare","esri/request","esri/PopupTemplate","esri/core/lang","esri/core/MultiOriginJSONSupport","esri/tasks/support/Query","esri/layers/Layer","esri/layers/FeatureLayer","esri/layers/support/fieldUtils","esri/renderers/support/styleUtils","esri/layers/mixins/PortalLayer","esri/layers/support/arcgisLayerUrl","esri/core/promiseUtils","esri/geometry/SpatialReference","../views/3d/support/fx3dUtils","../views/3d/layers/FxLayerView3D"],function(e,i,s,t,r,n,l,a,o,u,d,h,p,y,c,f,v,g,F,m){function z(i,s){return n(i,{query:e.mixin({f:"json"},null),responseType:"json",callbackParamName:"callback"}).then(function(t){if(t._ssl&&(delete t._ssl,i=i.replace(/^http:/i,"https:")),"Feature Layer"===t.data.type){var r={};r.availableVizTypes=F.availableVizTypes(t.data.geometryType,t.data.timeInfo),e.mixin(r,w(t.data.fields)),s(null,r)}else s("FxLayer can only accecpt a feature service.")})}function w(e){var i=[],t=[],r=["small-integer","integer","single","long","double"],n=["lat","latitude","y","ycenter","latitude83","latdecdeg","POINT-Y","lon","lng","long","longitude","x","xcenter","longitude83","longdecdeg","POINT-X","alt","altitude","z","POINT-Z","zcenter","altitude83","altdecdeg"];return s.forEach(e,function(e){i.push(e.name);var s=e.name.toLowerCase();r.indexOf(e.type)>-1&&n.indexOf(s)===-1&&t.push(e.name)}),{displayFields:i,vizFields:t}}var T=r([h],{declaredClass:"esri.layers.FxLayer",viewModulePaths:{"3d":"fx3d/views/3d/layers/FxLayerView3D"},properties:{renderingInfo:{value:null,set:function(i){var s=this._get("renderingInfo");e.isObject(i)&&!F.isEqual(i,s)&&this._set("renderingInfo",i)}},vizType:{value:null,set:function(i){var s=this._get("vizType");e.isString(i)&&!F.isEqual(i,s)&&this._set("vizType",i)}},displayField:{type:String,value:null,json:{ignore:!0},set:function(i){var s=this._get("displayField");e.isString(i)&&!F.isEqual(i,s)&&this._set("displayField",i)}},vizFields:{value:null,set:function(i){i=e.isString(i)?[i]:i;var s=this._get("vizFields");e.isArray(i)&&!F.isEqual(i,s)&&this._set("vizFields",i)}},spinTag:{value:!1,set:function(e){var i=this._get("spinTag");"boolean"==typeof e&&e!==i&&this._set("spinTag",e)}},pauseTag:{value:!1,set:function(e){var i=this._get("pauseTag");"boolean"==typeof e&&e!==i&&this._set("pauseTag",e)}}},constructor:function(e,i){this.inherited(arguments),this.importLayerViewModule(i.view),this.url=e,Object.keys(i).forEach(function(e){this[e]=i[e]}.bind(this)),this.outFields=["*"],this.listMode="hide"},normalizeCtorArgs:function(i,s){if(e.isString(i)&&F.isUrl(i)){var t=f.parse(i);return t&&null!=t.sublayer&&null==this.layerId&&(this.layerId=t.sublayer),e.mixin({},{url:t.url.path},s)}return console.warn("Data source must be a FeatureService url."),null},remove:function(){this.pauseAnimation(),this.pauseSpinning(),this.fxLayerView&&!1===this.fxLayerView.destroyed&&(this.fxLayerView.destroy(),this.fxLayerView=null),this.emit("destroy-fxlayer")},_initLayerProperties:function(t){this.source||(this.source=t),t.url&&(this.url=t.url);var r=this.source.relatedFeaturesInfo,n=a.mixin({},t.sourceJSON,r?{objectIdField:r.joinField}:{});if(r&&(this.source.relatedFeaturesInfo.outFields=this.outFields?this.outFields.splice(0):null),this.sourceJSON=t.sourceJSON,this.read(n,{origin:"service",url:this.parsedUrl}),r&&r.outFields&&"*"!==r.outFields[0]&&(r.outFields=r.outFields.map(function(e){return e.toLowerCase()})),this._verifySource(),this._verifyFields(),this.useQueryTimestamp=i("ie")||i("safari"),p.fixRendererFields(this.renderer,this.fields),this.listMode="hide",this.disablePopup=!0,this.visible=!0,this.declaredClass="esri.layers.FxLayer",this.renderer={type:"simple",symbol:{size:0,color:[0,0,0,0]}},!e.isArray(this.fields))return void console.warn("Fileds from source is invalid.");var o=w(this.fields),u=o.vizFields,d=o.displayFields,h=null,y=null;if(e.isString(this.displayField)&&0!==this.displayField.length?(y=null,h=s.some(d,function(e){if(e.toLowerCase()===this.displayField.toLowerCase())return y=e,!0}.bind(this)),h?this.set("displayField",y):this.set("displayField",d[0])):this.set("displayField",d[0]),e.isArray(this.vizFields)&&0!==this.vizFields.length){var c=[];s.forEach(u,function(e){c.push(e.toLowerCase())}),h=[],s.forEach(this.vizFields,function(e){var i=c.indexOf(e.toLowerCase());i>-1&&h.push(u[i])}.bind(this)),h.length>0?this.set("vizFields",h):this.set("vizFields",u[0])}else this.set("vizFields",u[0]);return this.availableVizTypes=F.availableVizTypes(this.geometryType,this.timeInfo),e.isString(this.vizType)&&0!==this.vizType.length?(y=null,h=s.some(this.availableVizTypes,function(e){if(e.name.toLowerCase()===this.vizType.toLowerCase())return y=e.name,!0}.bind(this)),h?this.vizType=y:this.vizType=this.availableVizTypes[0]?this.availableVizTypes[0].name:null):this.vizType=this.availableVizTypes[0]?this.availableVizTypes[0].name:null,this.popupTemplate||(this.popupTemplate=new l({title:this.name,fieldInfos:this.fields?s.map(this.fields,function(e){return{fieldName:e.name,label:e.name,visible:!0}}):[],content:"{*}"})),this.vizType&&0!=this.vizType.length&&this.displayField&&0!=this.displayField.length&&e.isArray(this.vizFields)&&0!=this.vizFields.length?(this.set("visible",!0),null):(this.set("visible",!1),this.set("loaded",!1),this.emit("fxlayer-error",{msg:"Properties of vizType, displayField, vizFields, renderingInfo, or popupTemplate is missing."}),void console.warn("Properties of vizType, displayField, vizFields, renderingInfo, or popupTemplate is missing."))},createQuery:function(){var e=new u,i=this.get("capabilities.data");return e.returnGeometry=!0,e.returnZ=i&&i.supportsZ&&this.returnZ||null,e.returnM=i&&i.supportsM&&this.returnM||null,e.outFields=this.outFields,e.where=this.definitionExpression||"1=1",e.multipatchOption="multipatch"===this.geometryType?"xyFootprint":null,e},createQueryParameters:function(){var e=new u;return e.outSpatialReference=g.WGS84,Object.defineProperty(e,"outSpatialReference",{configurable:!0,writable:!1}),e.returnGeometry=!0,e.returnZ=this.hasZ&&this.returnZ||null,e.returnM=this.hasM&&this.returnM||null,e.outFields=this.outFields,e.where=this.definitionExpression||"1=1",e.multipatchOption="multipatch"===this.geometryType?"xyFootprint":null,e},importLayerViewModule:function(e){"3d"===e.type&&(this.fxLayerView=new m({layer:this,view:e}))},showLabel:function(e){e&&this.emit("show-feature-label",{feature:e})},hideLabel:function(){this.emit("hide-feature-label")},startAnimation:function(){return this.visible?void(this.pauseTag=!1):void console.warn("The FxLayer is invisible now.")},pauseAnimation:function(){this.pauseTag=!0},startSpinning:function(){return this.visible?void(this.spinTag=!0):void console.warn("The FxLayer is invisible now.")},pauseSpinning:function(){this.spinTag=!1},switchVizField:function(i,t){function r(e){e>-1&&e<n.vizFields.length?(n.emit("hide-feature-label"),n.emit("fx3d-active-viz-field",{currentVizPage:e,newRenderingInfo:t})):console.warn("invalid viz page in switchVizField(vizField).")}if(!this.visible)return void console.warn("The FxLayer is invisible now.");var n=this;if(e.isString(i)){var l=[];s.forEach(this.vizFields,function(e){l.push(e.toLowerCase())});var a=l.indexOf(i.toLowerCase());r(a)}else"number"==typeof i?r(i):console.warn("switchVizField(vizField) needs a integer id or string name as parameter.")}});return e.mixin(T,{getFieldsAndVizTypes:function(i){var s=new t;return e.isString(i)?F.isUrl(i)&&z(i,function(e,i){e?s.reject(e):s.resolve(i)}):s.reject("FxLayer can only accecpt a feature service url now."),s}}),e.mixin(T,F.EffectType),T});