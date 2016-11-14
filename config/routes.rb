Rails.application.routes.draw do
  root to: 'application#angular'
  devise_for :users
  resources :avatars, only: [:create]
end