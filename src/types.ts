export interface Student {
  Student_ID: string;
  First_Name: string;
  Last_Initial: string;
  Grade_Level: string;
  Transition_Plan_Status: string;
  Date_of_Birth?: string;
  Eligibility_Code?: string;
  Parents_Names?: string;
  Phone_Number?: string;
  Address?: string;
  Age_Sept_1?: string;
  Date_IPP_Created?: string;
  School_Program?: string;
  Teacher_Name?: string;
  IPP_Coordinator?: string;
  Program_Administrator?: string;
  Additional_Team_Members?: string;
  Centre_Based_Hours?: string;
  Family_Oriented_Sessions?: string;
  Parental_Input?: string;
  Medical_Conditions?: string;
  Strengths_Summary?: string;
  Areas_of_Need_Summary?: string;
  Transition_Plan_Details?: string;
  Year_End_Summary?: string;
  School_Name?: string;
  School_Board?: string;
  Principal_Name?: string;
  Support_Services_Summary?: string;
  Current_Performance_Narrative?: string;
}

export interface SpecializedAssessment {
  Assessment_ID: number;
  Student_ID: string;
  Date: string;
  Test_Name: string;
  Results: string;
}

export interface Observation {
  Log_ID: number;
  Student_ID: string;
  Outcome_ID: number | null;
  Accommodation_ID: number | null;
  Timestamp: string;
  Raw_Dictation: string;
  AI_Scrubbed_Observation: string;
  Image_Path: string | null;
  Core_Subject_Area?: string;
  Enrolled_Grade_Level?: string;
  UDL_Purpose?: string;
  Recommended_Assistive_Tech?: string;
}

export interface Goal {
  Goal_ID: number;
  Student_ID: string;
  Goal_Description: string;
  Target_Date: string;
  Status: string;
  Core_Subject_Area: string;
  Timestamp: string;
  Objective_1_Description?: string;
  Objective_1_Assessment_Procedure?: string;
  Objective_1_Progress_Review?: string;
  Objective_2_Description?: string;
  Objective_2_Assessment_Procedure?: string;
  Objective_2_Progress_Review?: string;
  Objective_3_Description?: string;
  Objective_3_Assessment_Procedure?: string;
  Objective_3_Progress_Review?: string;
  Goal_Accommodations_Strategies?: string;
}

export interface CurriculumOutcome {
  Outcome_ID: number;
  Subject: string;
  Grade: string;
  Outcome_Code: string;
  Description: string;
}

export interface Evaluation {
  Evaluation_ID: number;
  Student_ID: string;
  Outcome_ID: number;
  Status: string;
  Timestamp: string;
  Subject?: string;
  Grade?: string;
  Outcome_Code?: string;
  Description?: string;
}

export interface VerticalAlignmentOutcome {
  Outcome_ID: number;
  Core_Subject_Area: string;
  Enrolled_Grade_Level: string;
  Below_Grade_Level_Descriptor: string;
  At_Grade_Level_Descriptor: string;
  Above_Grade_Level_Descriptor: string;
}
