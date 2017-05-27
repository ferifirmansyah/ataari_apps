import {Token} from './services/token.service';
import {AuthController} from './controller/auth.controller';
import {ProductController} from './controller/product.controller';

export function Routing(router:any){
    const tokenService: Token = new Token();
    const authController: AuthController = new AuthController();
    const prodController: ProductController = new ProductController();
    router.get('/test',authController.test);

    router.post('/authorization',authController.login);
    router.post('/childupdate',tokenService.verifyToken,authController.updatingChildData);

    router.get('/listprod',tokenService.verifyToken,prodController.productList);
    // router.get('/test',AuthController.login);

    // router.get('/admin/authorization',adminController.login);


    // router.post('/admin/changepass',tokenService.verifyToken,adminController.changePassword);
    // router.post('/admin/upload',tokenService.verifyToken,multipart,adminController.upload);
    // router.post('/admin/editfile',tokenService.verifyToken,multipart,adminController.editFile);
    // router.post('/admin/deletefile',tokenService.verifyToken,adminController.deleteFile);
    // router.get('/admin/getlist',tokenService.verifyToken,appController.getCatAndFile);
    // router.post('/admin/category/add',tokenService.verifyToken,adminController.categoryAdd);
    // router.post('/admin/category/update',tokenService.verifyToken,adminController.categoryUpdate);
    // router.post('/admin/category/delete',tokenService.verifyToken,adminController.categoryDelete);
    
    // router.get('/app/download',appController.download);
    // router.get('/app/getlist',appController.getCatAndFile);
}