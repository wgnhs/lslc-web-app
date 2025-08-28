# LSLC-Web-App
Web Application for viewing the WGNHS Lake Superior Legacy Collection
This website is now live at http://data.wgnhs.wisc.edu/lake-superior-legacy/. The goal of the interface is to provide a way for users to search, view, and download our Lake Superior Legacy Collection data, including photos of rock samples and their associated field notes, microscope slides, and descriptions.  

The website has been publically available since August 2017, and we occasionally make small improvements. 

### Origins of the collection 
This collection of geologic samples originates with geologists studying the Lake Superior region from the 1880s through the first two decades of the 1900s. These geologists embarked on field expeditions, where they collected **hand samples**, or pieces of rock that could be held in the palm of a hand, and recorded their observations in **field notebooks**. The hand samples were brought back to Madison, where some were cut and ground to create one or more **thin sections**, or thin slices of rock which allow light to pass through. These thin sections were viewed under a microscope in both plane-polarized and cross-polarized light. Geologists then wrote **lithological descriptions** of some of the thin sections based on their observations using a microscope. 


### Digitized

The Wisconsin Geological and Natural History survey has received funding to digitize this extensive collection of geologic samples and data. 



| Item                         | How many? | Digitized representation                                  |   |
|------------------------------|---|-----------------------------------------------------------|---|
| field notebooks               | 321 scanned | PDF scans                                                  | ![notebook image](images/tinyThumbnails/notebook02_spread_tiny.jpg)  |
| hand samples                  | over 30,000 records digitized | metadata records                                                          |   |
| thin sections (microscope slides)                | 15,608 photographed | high-resolution photos in plane-polarized and cross-polarized light|  ![thin section image](images/tinyThumbnails/thinSec23_tiny.jpg) |
| books of lithological descriptions | 6 scanned | PDF scans                                                 | ![lith book image](images/tinyThumbnails/lithbookVI_spread_tiny.jpg)  |  |


## Deployment

This project is built automatically via Github Actions when a pull request is merged to the `master` branch of this repository. The code must be pulled down to the IIS server manually when the Github Actions job completes.

### Build code via Github
1. On your local machine, checkout the master branch and pull the latest code 

        git checkout master
        git pull origin master

2. On your local machine, checkout a new working branch

        git checkout -b my-feature-branch

3. Make your code changes, then add, commit and push them to your working branch
        
        git add 
        git commit -m "update abc for xyz reason"
        git push origin my-feature-branch

4. Sign into Github and navigate to this repository https://github.com/wgnhs/lslc-web-app
5. Click Pull requests then New pull requests (or go to https://github.com/wgnhs/lslc-web-app/compare)
6. Leave `base:master`, set compare to your working branch, ex `compare;my-feature-branch` and click Create pull request
7. Add any additional comments in the Description box click Create pull request
8. Click Merge pull request, then click Confirm merge
9. After the pull request is successfully merged, the [Build and push to deploy-prod branch Github Action](https://github.com/wgnhs/lslc-web-app/actions/workflows/build-push-to-branch.yml) will be triggered. This Github Action builds the code and pushes only the contents of the dist/ folder to the deploy-prod branch. Follow progress in https://github.com/wgnhs/lslc-web-app/actions. 

### Pull updated code onto IIS server
After the code is pushed to the deploy-prod branch, it must be manually pulled down from Gitlab to the corresponding directory on the IIS server. See WGNHS Gitlab repo for Hydro Data Viewer for instructions.