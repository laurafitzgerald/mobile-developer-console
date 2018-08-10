package web

import (
	"github.com/aerogear/mobile-client-service/pkg/apis/aerogear/v1alpha1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

//MobileAppCreateRequest is the data type for the create request
type MobileAppCreateRequest struct {
	//has to be unique per namespace, can not be changed later
	Name          string `json:"name" validate:"required"`
	ClientType    string `json:"clientType" validate:"required,oneof=android iOS cordova xamarin"`
	AppIdentifier string `json:"appIdentifier"" validate:"required"`
	DmzUrl        string `json:"dmzUrl"`
}

//MobileAppUpdateRequest is the data type for the update request
type MobileAppUpdateRequest struct {
	AppIdentifier string `json:"appIdentifier" validate:"required"`
}

//MobileClientServiceData represents the services in the `mobile-services.json` file
type MobileClientServiceData struct {
	Id     string                 `json:"id"`
	Name   string                 `json:name`
	Type   string                 `json:type`
	Url    string                 `json:url`
	Config map[string]interface{} `json:"config"`
}

//MobileClientData represents the API data for the MobileClient
type MobileClientData struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata"`
	Spec              v1alpha1.MobileClientSpec `json:"spec"`
	Status            MobileClientStatusData    `json:"status"`
}

//MobileClientStatusData represents the content in the `mobile-services.json` file
type MobileClientStatusData struct {
	Version     int                       `json:"version"`
	ClusterName string                    `json:"clusterName"`
	Namespace   string                    `json:"namespace"`
	ClientId    string                    `json:"clientId"`
	Services    []MobileClientServiceData `json:"services"`
}

//MobileClientDataList is the list of MobileClientServiceData
type MobileClientDataList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata"`
	Items           []MobileClientData `json:"items"`
}