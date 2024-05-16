(()=>{"use strict";var e={811:function(e,t,o){var n=this&&this.__createBinding||(Object.create?function(e,t,o,n){void 0===n&&(n=o);var i=Object.getOwnPropertyDescriptor(t,o);i&&!("get"in i?!t.__esModule:i.writable||i.configurable)||(i={enumerable:!0,get:function(){return t[o]}}),Object.defineProperty(e,n,i)}:function(e,t,o,n){void 0===n&&(n=o),e[n]=t[o]}),i=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),r=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var o in e)"default"!==o&&Object.prototype.hasOwnProperty.call(e,o)&&n(t,e,o);return i(t,e),t},u=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),o(469);const a=u(o(252)),d=u(o(96)),s=u(o(577)),l=u(o(525)),f=u(o(898)),c=r(o(140)),p=u(o(715)),h=u(o(225)),v=u(o(236)),y=u(o(116)),_=u(o(825)),m=u(o(87)),w=u(o(375)),g=u(o(239)),b=u(o(457)),O=u(o(418)),j=(0,a.default)();j.use((0,l.default)()),j.use((0,d.default)("dev")),j.use((0,f.default)(O.default.COOKIE_SECRET)),j.use((0,s.default)({origin:[O.default.ADMIN_CLIENT_URL],credentials:!0})),j.use(a.default.json()),j.use(a.default.urlencoded({extended:!0})),j.get("/",((e,t)=>t.status(200).send('\n  <div style="display: flex; align-items: center; justify-content: center; height: 90vh"> \n    <h1 style="font-size: 72px; background: -webkit-linear-gradient(45deg, #09009f, #00ff95 80%); -webkit-background-clip: text;\n    -webkit-text-fill-color: transparent;">VOO TV REST API</h1>\n  </div>\n'))),j.use("/user",p.default),j.use("/audio",h.default),j.use("/location",v.default),j.use("/service",y.default),j.use("/testimony",_.default),j.use("/stream",m.default),j.use("/download",w.default),j.use("/program",g.default),j.use("/tests",b.default),j.use(((e,t,o)=>o((0,c.default)(404,"Endpoint not found")))),j.use(((e,t,o,n)=>{console.error(e);let i="An unknown error occurred",r=500;(0,c.isHttpError)(e)&&(r=e.status,i=e.message),o.status(r).json(i)})),t.default=j},48:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(i,r){function u(e){try{d(n.next(e))}catch(e){r(e)}}function a(e){try{d(n.throw(e))}catch(e){r(e)}}function d(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(u,a)}d((n=n.apply(e,t||[])).next())}))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const r=o(548),u=i(o(140)),a=o(737),d=i(o(297));t.default=(0,r.Controller)({getAudios(e,t){return n(this,void 0,void 0,(function*(){const e=yield d.default.audio.findMany();t.status(200).json(e)}))},getAudio(e,t){return n(this,void 0,void 0,(function*(){const{id:o}=e.params,n=yield d.default.audio.findUnique({where:{id:o}});if(!n)throw(0,u.default)("Audio doesn't exist");return t.status(200).json(n)}))},addAudio(e,t){return n(this,void 0,void 0,(function*(){const{title:o,preacher:n,timeRecorded:i}=e.body;if(!e.file)throw(0,u.default)(403,"No file received");const r=e.file.buffer,s=yield(0,a.uploadBuffer)(r,"auto","vootv-api/audios"),{secure_url:l,public_id:f,bytes:c}=s;yield d.default.audio.create({data:{link:l,preacher:n,timeRecorded:new Date(i),size:c,cloudId:f,title:o}}),t.status(201).json("Audio added")}))},deleteAudio(e,t){return n(this,void 0,void 0,(function*(){const{id:o}=e.params,n=yield d.default.audio.findUnique({where:{id:o}});if(!n)throw(0,u.default)(404,"Audio not found");const i=yield d.default.audio.delete({where:{id:n.id}});if(!i)throw(0,u.default)("Could not delete audio, try again later");return yield a.cloudinary.uploader.destroy(i.cloudId,{invalidate:!0,resource_type:"video"}),t.status(200).json("Audio deleted")}))}})},255:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(i,r){function u(e){try{d(n.next(e))}catch(e){r(e)}}function a(e){try{d(n.throw(e))}catch(e){r(e)}}function d(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(u,a)}d((n=n.apply(e,t||[])).next())}))},i=this&&this.__rest||function(e,t){var o={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(o[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(n=Object.getOwnPropertySymbols(e);i<n.length;i++)t.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(e,n[i])&&(o[n[i]]=e[n[i]])}return o},r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const u=o(548),a=r(o(140)),d=r(o(297));t.default=(0,u.Controller)({addLocation(e,t){return n(this,void 0,void 0,(function*(){const{country:o,state:n,pastorInCharge:i}=e.body;if(yield d.default.location.findUnique({where:{country_state_pastorInCharge:{country:o,state:n,pastorInCharge:i}}}))throw(0,a.default)(403,"Location exists");return yield d.default.location.create({data:e.body}),t.status(201).send("New location added")}))},getLocations(e,t){return n(this,void 0,void 0,(function*(){const e=yield d.default.location.findMany();return t.status(200).json(e)}))},getLocation(e,t){return n(this,void 0,void 0,(function*(){const{id:o}=e.params,n=yield d.default.location.findUnique({where:{id:o},include:{services:!0}});if(!n)throw(0,a.default)("Location does not exist");return t.status(200).json(n)}))},updateLocation(e,t){return n(this,void 0,void 0,(function*(){const{id:o}=e.params,n=yield d.default.location.findUnique({where:{id:o}});if(!n)throw(0,a.default)(403,"Location not found");const{id:r}=n,u=i(n,["id"]);return yield d.default.location.update({where:{id:n.id},data:Object.assign(Object.assign({},u),e.body)}),t.status(200).send("Location details updated")}))}})},578:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(i,r){function u(e){try{d(n.next(e))}catch(e){r(e)}}function a(e){try{d(n.throw(e))}catch(e){r(e)}}function d(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(u,a)}d((n=n.apply(e,t||[])).next())}))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const r=o(548),u=i(o(140)),a=i(o(297)),d=o(737);t.default=(0,r.Controller)({addProgram(e,t){return n(this,void 0,void 0,(function*(){if(e.body.startTime=new Date(e.body.startTime),e.body.endTime=new Date(e.body.endTime),!e.file)throw(0,u.default)(403,"No Image added");const{buffer:o}=e.file,n=yield(0,d.uploadBuffer)(o,"image","vootv-api/banners"),{secure_url:i,public_id:r}=n;return yield a.default.program.create({data:Object.assign(Object.assign({},e.body),{banner:{secure_url:i,public_id:r}})}),t.status(201).send("Program Added successfully")}))},getPrograms(e,t){return n(this,void 0,void 0,(function*(){const e=yield a.default.program.findMany({include:{location:{select:{state:!0,country:!0}}}});return t.status(200).json(e)}))},getProgram(e,t){return n(this,void 0,void 0,(function*(){const{id:o}=e.params,n=yield a.default.program.findUnique({where:{id:o}});return t.status(200).json(n)}))}})},197:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(i,r){function u(e){try{d(n.next(e))}catch(e){r(e)}}function a(e){try{d(n.throw(e))}catch(e){r(e)}}function d(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(u,a)}d((n=n.apply(e,t||[])).next())}))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const r=o(548),u=i(o(140)),a=i(o(297));t.default=(0,r.Controller)({addService(e,t){return n(this,void 0,void 0,(function*(){const{theme:o,day:n}=e.body,{locationId:i}=e.params,r=yield a.default.location.findUnique({where:{id:i}});if(!r)throw(0,u.default)(404,"Location not found");if(yield a.default.service.findUnique({where:{theme_day:{theme:o,day:n}}}))throw(0,u.default)(403,"Service exists, update to continue");return yield a.default.service.create({data:Object.assign(Object.assign({},e.body),{locationId:i})}),t.status(201).send(`Service added for RCN ${r.state}`)}))},updateService(){return n(this,void 0,void 0,(function*(){}))}})},796:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(i,r){function u(e){try{d(n.next(e))}catch(e){r(e)}}function a(e){try{d(n.throw(e))}catch(e){r(e)}}function d(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(u,a)}d((n=n.apply(e,t||[])).next())}))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const r=o(548),u=i(o(297));t.default=(0,r.Controller)({addStream(e,t){return n(this,void 0,void 0,(function*(){return yield u.default.stream.create({data:e.body}),t.status(201).send("Stream added")}))}})},308:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(i,r){function u(e){try{d(n.next(e))}catch(e){r(e)}}function a(e){try{d(n.throw(e))}catch(e){r(e)}}function d(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(u,a)}d((n=n.apply(e,t||[])).next())}))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const r=o(548),u=i(o(140)),a=i(o(297));t.default=(0,r.Controller)({addTestimony(e,t){return n(this,void 0,void 0,(function*(){return yield a.default.testimony.create({data:Object.assign(Object.assign({},e.body),{userId:e.user.id})}),t.status(201).send("Testimony added")}))},getTestimonies(e,t){return n(this,void 0,void 0,(function*(){const e=yield a.default.testimony.findMany();return t.status(201).json(e)}))},getTestimony(e,t){return n(this,void 0,void 0,(function*(){const{id:o}=e.params,n=yield a.default.testimony.findUnique({where:{id:o}});if(!n)throw(0,u.default)(404,"Testimony not found");return t.status(200).json(n)}))}})},435:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(i,r){function u(e){try{d(n.next(e))}catch(e){r(e)}}function a(e){try{d(n.throw(e))}catch(e){r(e)}}function d(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(u,a)}d((n=n.apply(e,t||[])).next())}))},i=this&&this.__rest||function(e,t){var o={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(o[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(n=Object.getOwnPropertySymbols(e);i<n.length;i++)t.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(e,n[i])&&(o[n[i]]=e[n[i]])}return o},r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const u=o(548),a=o(729),d=r(o(140)),s=r(o(982)),l=o(903),f=o(977),c=r(o(297)),p=o(737);t.default=(0,u.Controller)({getUsers(e,t){return n(this,void 0,void 0,(function*(){const e=yield c.default.user.findMany({where:{role:"USER"}});return t.status(200).json(e)}))},getUser(e,t){return n(this,void 0,void 0,(function*(){const{id:o}=e.params,n=yield c.default.user.findUnique({where:{id:o},include:{location:{select:{state:!0}}}});return t.status(200).json(n)}))},register(e,t){return n(this,void 0,void 0,(function*(){const{email:o,password:n,phoneNumber:i}=e.body;if(yield c.default.user.findFirst({where:{OR:[{email:o},{phoneNumber:i}]}}))throw(0,d.default)(403,"Account already exists, please login");const r=yield(0,a.hash)(n,10),u=yield c.default.user.create({data:Object.assign(Object.assign({},e.body),{password:r,role:"USER"})}),{email:l,id:p}=u,h=s.default.randomInt(1e3,9999).toString(),v=yield c.default.verficationCode.create({data:{userId:p,code:h,action:"EMAIL_VERIFICATION"}});yield f.default_transporter.sendMail({from:"RCN Global Network",to:u.email,subject:"Email verification code",html:`<p>This is your verification code. It will expire in 15 minutes.</p><strong>${v.code}</strong>`,replyTo:"noreply@rcn.com"});return t.status(200).json({message:"Verification code sent to email address",userId:p})}))},verifyEmail(e,t){return n(this,void 0,void 0,(function*(){const{code:o}=e.body,{id:n}=e.user,i=yield c.default.verficationCode.findUnique({where:{userId_action:{userId:n,action:"EMAIL_VERIFICATION"}}});if(!i)throw(0,d.default)(403,"Code expired, request new code");if(i.code!==o)throw(0,d.default)(403,"Invalid code, retry");return yield c.default.user.update({where:{id:n},data:{emailVerified:!0}}),yield c.default.verficationCode.delete({where:{id:i.id}}),t.status(200).send("Email verification successful")}))},resendVerificationCode(e,t){return n(this,void 0,void 0,(function*(){return t.status(200).json("Okay")}))},login(e,t){return n(this,void 0,void 0,(function*(){const{email:o,password:n}=e.body,{admin:r}=e.query,u=yield c.default.user.findUnique({where:{email:o}});if(!u)throw(0,d.default)(403,"Invalid email or password");if("true"==r&&"ADMIN"!=u.role)throw(0,d.default)(403,"Unknown Error Occured");if(!(yield(0,a.compare)(n,u.password)))throw(0,d.default)(403,"Invalid email or password");if(!u.emailVerified)throw(0,d.default)(403,"Please verify your email");const s=(0,l.v4)(),f=new Date((new Date).getTime()+12096e5),p=yield c.default.authToken.create({data:{userId:u.id,token:s,expiresAt:f}}),{password:h,emailVerified:v,role:y,updatedAt:_}=u,m=i(u,["password","emailVerified","role","updatedAt"]);return"ADMIN"==u.role?t.cookie("rcn.session.token",p.token,{signed:!0,maxAge:12096e5}).status(200).send("Login successful"):(t.setHeader("Authorization",`Bearer ${p.token}`),t.status(200).json({message:"Log in success",user:m}))}))},sendPasswordResetMail(e,t){return n(this,void 0,void 0,(function*(){const{email:o}=e.body,n=yield c.default.user.findUnique({where:{email:o}});if(!n)throw(0,d.default)(403,"User not found");const i=s.default.randomInt(1e3,9999).toString(),r=yield c.default.verficationCode.create({data:{userId:n.id,code:i,action:"PASSWORD_RESET"}});if(!r)throw(0,d.default)(403,"Could not create verification code");yield f.default_transporter.sendMail({from:"RCN Global Network",to:n.email,subject:"Password reset code",html:`<p>This is your password reset code. It expires in 15 minutes.</p><strong>${r.code}</strong>`,replyTo:"noreply@rcn.com"});return t.status(200).json("Password reset code sent to your mail")}))},verifyPasswordResetCode(e,t){return n(this,void 0,void 0,(function*(){const{code:o,userId:n}=e.body,i=yield c.default.verficationCode.findFirst({where:{code:o,userId:n,action:"PASSWORD_RESET"}});if(!i)throw(0,d.default)(403,"Code expired, request new code");if(o!==i.code)throw(0,d.default)(403,"Invalid code, try again");return t.status(200).json("Verified")}))},changePassword(e,t){return n(this,void 0,void 0,(function*(){const{password:o}=e.body,{id:n}=e.user,i=yield(0,a.hash)(o,10);return yield c.default.user.update({where:{id:n},data:{password:i}}),t.status(200).json("Password changed")}))},updateAccount(e,t){return n(this,void 0,void 0,(function*(){const{id:o}=e.user;let n=e.body;if(e.file){const{buffer:t}=e.file;e.user.avi.public_id&&(yield p.cloudinary.uploader.destroy(e.user.avi.public_id,{invalidate:!0}),yield c.default.user.update({where:{id:o},data:{avi:null}}));const i=yield(0,p.uploadBuffer)(t,"image","vootv-api/pfps"),{secure_url:r,public_id:u}=i;n=Object.assign(Object.assign({},e.body),{avi:{secure_url:r,public_id:u}})}return yield c.default.user.update({where:{id:o},data:n}),t.status(200).json("Account details updated")}))},logout(e,t){return n(this,void 0,void 0,(function*(){yield e.logout(),t.status(200).send("Logout successful")}))}})},156:function(e,t,o){var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const i=n(o(811)),r=n(o(418)).default.PORT;i.default.listen(r,(()=>console.log("Listening on PORT "+r)))},138:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(i,r){function u(e){try{d(n.next(e))}catch(e){r(e)}}function a(e){try{d(n.throw(e))}catch(e){r(e)}}function d(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(u,a)}d((n=n.apply(e,t||[])).next())}))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.logout=t.authenticate=t.verifyUser=void 0;const r=i(o(140)),u=i(o(297)),a=o(548),d=(0,a.asyncWrapper)(((e,t,o)=>n(void 0,void 0,void 0,(function*(){e.logout=()=>n(void 0,void 0,void 0,(function*(){const{authorization:o}=e.headers,n=(null==o?void 0:o.split(" ")[1])||e.signedCookies["rcn.session.token"];if(!n)return!0;const i=yield u.default.authToken.findUnique({where:{token:n}});return!i||(yield u.default.authToken.delete({where:{token:i.token}}),t.clearCookie("rcn.session.token"),!0)})),o()}))));t.logout=d;const s=(0,a.asyncWrapper)(((e,t,o)=>n(void 0,void 0,void 0,(function*(){const t=e.body.userId||e.params.userId;if(!t)throw(0,r.default)(403,"Invalid ID");const n=yield u.default.user.findUnique({where:{id:t}});if(!n)throw(0,r.default)(404,"User not found");e.user=n,o()}))));t.verifyUser=s;const l=(0,a.Controller)({user(e,t,o){return n(this,void 0,void 0,(function*(){const{authorization:t}=e.headers,n=null==t?void 0:t.split(" ")[1];if(!n)throw(0,r.default)(401,"Unauthorized");const i=yield u.default.authToken.findUnique({where:{token:n}});if(!i)throw(0,r.default)(401,"Session expired");const a=yield u.default.user.findUnique({where:{id:i.userId}});if(!a)throw(0,r.default)(404,"User not found");const d=new Date((new Date).getTime()+12096e5);yield u.default.authToken.update({where:{token:i.token},data:{expiresAt:d}}),e.user=a,o()}))},admin:(e,t,o)=>n(void 0,void 0,void 0,(function*(){const n=e.signedCookies["rcn.session.token"];if(!n)throw(0,r.default)(401,"Unauthorized, no token");const i=yield u.default.authToken.findUnique({where:{token:n}});if(!i)throw t.clearCookie("rcn.session.token"),(0,r.default)(401,"Session expired");const a=yield u.default.user.findUnique({where:{id:i.userId}});if(!a)throw(0,r.default)(401,"User not found");if("ADMIN"!=a.role)throw(0,r.default)(401,"Unauthorized, not an admin");const d=new Date((new Date).getTime()+12096e5);if(yield u.default.authToken.update({where:{token:i.token},data:{expiresAt:d}}),e.query.admin)return t.status(200).send("Authenticated");e.user=a,o()}))});t.authenticate=l},225:function(e,t,o){var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const i=o(252),r=n(o(48)),u=n(o(461)),a=o(138),d=(0,u.default)({storage:u.default.memoryStorage()}),s=(0,i.Router)();s.get("/",a.authenticate.admin,r.default.getAudios),s.get("/:id",r.default.getAudio),s.post("/",d.single("audio"),r.default.addAudio),s.delete("/:id",r.default.deleteAudio),t.default=s},375:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0});const n=(0,o(252).Router)();t.default=n},236:function(e,t,o){var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const i=o(252),r=n(o(255)),u=o(138),a=(0,i.Router)();a.get("/",r.default.getLocations),a.get("/:id",r.default.getLocation),a.post("/",u.authenticate.admin,r.default.addLocation),a.patch("/:id",u.authenticate.admin,r.default.updateLocation),t.default=a},239:function(e,t,o){var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const i=o(252),r=n(o(578)),u=o(138),a=n(o(461)),{admin:d}=u.authenticate,s=(0,a.default)({storage:a.default.memoryStorage()}),l=(0,i.Router)();l.get("/",r.default.getPrograms),l.get("/:id",r.default.getProgram),l.post("/",d,s.single("banner"),r.default.addProgram),t.default=l},116:function(e,t,o){var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const i=o(252),r=n(o(197)),u=(0,i.Router)();u.post("/:locationId",r.default.addService),u.patch("/:id"),t.default=u},87:function(e,t,o){var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const i=o(252),r=n(o(796)),u=(0,i.Router)();u.post("/",r.default.addStream),t.default=u},825:function(e,t,o){var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const i=o(252),r=n(o(308)),u=o(138),a=(0,i.Router)();a.use(u.authenticate.user),a.get("/",r.default.getTestimonies),a.get("/:id",r.default.getTestimony),a.post("/",r.default.addTestimony),t.default=a},715:function(e,t,o){var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const i=o(252),r=n(o(435)),u=o(138),a=n(o(461)),{user:d,admin:s}=u.authenticate,l=(0,a.default)({storage:a.default.memoryStorage()}),f=(0,i.Router)();f.use(u.logout),f.get("/auth",u.authenticate.admin),f.get("/",s,r.default.getUsers),f.get("/:id",s,r.default.getUser),f.post("/register",r.default.register),f.post("/login",r.default.login),f.patch("/account-info",d,l.single("avi"),r.default.updateAccount),f.post("/password-reset-mail",r.default.sendPasswordResetMail),f.post("/verify-password-reset",r.default.verifyPasswordResetCode),f.put("/reset-password",u.verifyUser,r.default.changePassword),f.post("/verify-email",u.verifyUser,r.default.verifyEmail),f.post("/logout",r.default.logout),t.default=f},457:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0});const n=o(252),i=o(903),r=(0,n.Router)();r.get("/",((e,t)=>{const o=(0,i.v4)();t.send(o)})),t.default=r},737:function(e,t,o){var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.uploadBuffer=t.cloudinary=void 0;const i=n(o(353)),r=o(416);Object.defineProperty(t,"cloudinary",{enumerable:!0,get:function(){return r.v2}});const u=n(o(418));r.v2.config({cloud_name:u.default.CLOUD_NAME,api_key:u.default.CLOUD_API_KEY,api_secret:u.default.CLOUD_API_SECRET,secure:!0});t.uploadBuffer=(e,t,o)=>new Promise(((n,u)=>{const a=r.v2.uploader.upload_stream({folder:o,resource_type:t},((e,t)=>{e?u(e):n(t)}));i.default.createReadStream(e).pipe(a)}))},297:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0});const n=o(330);let i;global.__prisma||(global.__prisma=new n.PrismaClient),i=global.__prisma,t.default=i},418:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0});const n=o(991);t.default=(0,n.cleanEnv)(process.env,{PORT:(0,n.port)(),JWT_SECRET:(0,n.str)(),ADMIN_EMAIL:(0,n.email)(),ADMIN_PASSWORD:(0,n.str)(),CLOUD_NAME:(0,n.str)(),CLOUD_API_KEY:(0,n.str)(),CLOUD_API_SECRET:(0,n.str)(),COOKIE_SECRET:(0,n.str)(),ADMIN_CLIENT_URL:(0,n.str)()})},977:function(e,t,o){var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.default_transporter=void 0;const i=n(o(572)),r=n(o(928)),u=n(o(628)),a=n(o(418)),d=i.default.createTransport({service:"gmail",port:465,secure:!0,auth:{user:a.default.ADMIN_EMAIL,pass:a.default.ADMIN_PASSWORD}});t.default_transporter=d;const s={viewEngine:{extname:".handlebars",partialsDir:r.default.resolve(__dirname,"../views/partials"),defaultLayout:!1},viewPath:r.default.resolve(__dirname,"../views"),extName:".handlebars"};d.use("compile",(0,u.default)(s)),t.default=d},548:function(e,t){var o=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(i,r){function u(e){try{d(n.next(e))}catch(e){r(e)}}function a(e){try{d(n.throw(e))}catch(e){r(e)}}function d(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(u,a)}d((n=n.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.Controller=t.asyncWrapper=void 0;t.asyncWrapper=e=>(t,n,i)=>o(void 0,void 0,void 0,(function*(){try{yield e(t,n,i)}catch(e){i(e)}}));t.Controller=e=>{for(let o of Object.keys(e))e[o]=(0,t.asyncWrapper)(e[o]);return e}},330:e=>{e.exports=require("@prisma/client")},729:e=>{e.exports=require("bcryptjs")},416:e=>{e.exports=require("cloudinary")},898:e=>{e.exports=require("cookie-parser")},577:e=>{e.exports=require("cors")},469:e=>{e.exports=require("dotenv/config")},991:e=>{e.exports=require("envalid")},252:e=>{e.exports=require("express")},525:e=>{e.exports=require("helmet")},140:e=>{e.exports=require("http-errors")},96:e=>{e.exports=require("morgan")},461:e=>{e.exports=require("multer")},572:e=>{e.exports=require("nodemailer")},628:e=>{e.exports=require("nodemailer-express-handlebars")},353:e=>{e.exports=require("streamifier")},903:e=>{e.exports=require("uuid")},982:e=>{e.exports=require("crypto")},928:e=>{e.exports=require("path")}},t={};(function o(n){var i=t[n];if(void 0!==i)return i.exports;var r=t[n]={exports:{}};return e[n].call(r.exports,r,r.exports,o),r.exports})(156)})();
//# sourceMappingURL=index.js.map