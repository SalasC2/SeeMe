class UsersController < ApplicationController
  def index
    @users = User.all
  end
  def new
    @user = User.new
  end
  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to "/users/#{@user.id}/profile"
    else
      flash[:danger] = "Error you didn't fill in the required fields!!"
      render 'new'
    end
  end

  def profile
    @user = User.find(params[:id])
  end

  def user_params
     params.require(:user).permit(:first_name,:last_name, :email,:job,:discoverable)
  end
end
