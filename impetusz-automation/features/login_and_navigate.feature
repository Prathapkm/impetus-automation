Feature: Login and Navigate to Edited Module
  As a user of the Impetusz platform
  I want to login, select the FTF role, and navigate to the Edited module
  So that I can access the relevant functionality

  @smoke @regression
  Scenario: Successfully login and navigate to Edited module as FTF
    Given I am on the Impetusz login page
    When I login with username "prathapa.k@ril.com" and password "John.wick@RIL7"
    Then I should be logged in successfully
    When I select the "FTF" role
    Then I should be on the dashboard with "FTF" role
    When I click on the Edited module
    Then I should be on the Edited module page
