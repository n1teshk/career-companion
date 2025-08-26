require "test_helper"

class FinalsControllerTest < ActionDispatch::IntegrationTest
  test "should get controller" do
    get finals_controller_url
    assert_response :success
  end
end
