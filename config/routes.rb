Rails.application.routes.draw do
  root to: 'application#angular'
  devise_for :users
  resources :avatars, only: [:create]
  resources :projects, only: [:create, :update, :destroy, :index, :show]
  get '/activities', to: 'activities#activities'
end