#ISP Server Project
This is the server side code for ISP management project. Code is built on Express framework and uses MongoDB for storage purpose.
This app is useful for storing ISP data, retreiving it and downloading the details in form of pdf.

##Pre-requisite
Your system should have npm version >6.x.x and node version > 11.x.x.

##Installation
* Clone or download the repo from github.
* Open the folder in terminal
* Run this to install dependencies  
    ```
    npm i
    ```
* Pdf generation dependency requires chromium, so it can take time.

##Development Server
To start the server locally run :
```
npm run devstart
```
This will start nodemon server on localhost:4000 by default. You can change PORT in nodemon.json file.

##API list

###GET ISP List
* Access point : /api/isp
* Methods: **GET**
* Return list of isp queried on the basis of parameters.
* Params for filter:  
   * **orderBy**: 'ASC' | 'DES'; (Ascending | Descending)
   * **sortBy**: 'name' | 'price' | 'rating'
   * **searchText**: any string
* Example: /api/isp?searchText=Air&sortBy=rating&orderBy=DES
* Response : { ispList: [] }

###GET Total ISP Count
* Access point : /api/isp/count
* Method : **GET**
* Returns total number of ISP present in DB.
* Response : { totalISPCount: 0}

###GET Total API Count
* Access point: /api/querycount/total
* Method : **GET**
* Returns number of time ISP List get API was hit.
* Response : { totalCount: 0}

###POST ISP Data
* Access point: /api/isp
* Method: **POST**
* Add new ISP to the DB
* Form data needed in body:
    * **image** : Image File (.jpg, .jpeg and .png)
    * **name** : String (Unique)
    * **description**: String
    * **lowest_price** : Number
    * **rating**: Number
    * **url** : String
    * **email** : String
    * **contact_number**: String
    * **max_speed**: String
* Response : ISP data with updated id in **_id**

###Delete ISP Data
* Access point: /api/isp
* Method: **DELETE**
* Delete the ISP document from DB by id provided
* Params:
    * **id**: ObjectId as string

* Example : api/isp?id=abcdef12345678

###Download ISP Data as pdf
* Access point: /apo/isp/download/:id
* Method: **GET**
* On calling this api with appropriate id, a pdf will be automatically downloaded in browser

##Additional Note
* Some features might not work on heroku deployment:
    * Download as pdf will not work on heroku as chromium dependency gets missing
    * Images of new ISPs are stored in file storage under Public folder. So they can be removed on re-deployment to heroku. This can be resolved by adding cloud bucket like Amazon S3, google cloude storage.