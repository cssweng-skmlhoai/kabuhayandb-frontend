import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import ClearableInputField from "@/components/MemberCompts/ClearableInputField";
import ClearableSelectField from "@/components/MemberCompts/ClearableSelectField";
import CheckboxField from "@/components/MemberCompts/CheckboxField";
import ConfirmDialog from "@/components/MemberCompts/ConfirmDialog";
import "./Members.css";

const HousingUtilities = () => {
  const form = useForm({
    defaultValues: {
      tct_no: "014-3127112878",
      block_no: "2",
      lot_no: "3",
      open_space_share: "8.08",
      total: "34.07",
      confirmity_signature: "",
      remarks: "Remark",
      meralco: 0,
      maynilad: 1,
      septic_tank: 0,
      condition_type: "Needs minor repair",
      land_acquisition: "Direct Buying",
      status_of_occupancy: "Owner",
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="main">
      <div className="btn-div">
        {isEditing ? (
          <>
            <Button variant="cancel" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <ConfirmDialog
              title="Save Changes"
              description="Are you sure you want to save these changes?"
              triggerLabel="Save Details"
              onConfirm={() => setIsEditing(false)}
              variant="edit_details"
            />
          </>
        ) : (
          <Button variant="edit_details" onClick={() => setIsEditing(true)}>
            Edit Details
          </Button>
        )}
      </div>
      <Form {...form}>
        <div className="info">
          <Card className="card">
            <CardContent className="card-content">
              <div className="space-y-4 mt-4 grid gap-4 sm:grid-cols-2">
                <ClearableInputField
                  control={form.control}
                  name="tct_no"
                  label="TCT No."
                  isEditing={isEditing}
                />
                <div className="flex gap-4">
                  <ClearableInputField
                    control={form.control}
                    name="block_no"
                    label="Block No."
                    className="w-1/2"
                    isEditing={isEditing}
                  />
                  <ClearableInputField
                    control={form.control}
                    name="lot_no"
                    label="Lot No."
                    className="w-1/2"
                    isEditing={isEditing}
                    inputType="number"
                  />
                </div>
                <ClearableInputField
                  control={form.control}
                  name="open_space_share"
                  label="Share of Open Space"
                  isEditing={isEditing}
                />
                <ClearableInputField
                  control={form.control}
                  name="total"
                  label="Total"
                  isEditing={isEditing}
                  inputType="number"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="card-content">
              <div className="space-y-4 mt-4 grid gap-4 sm:grid-cols-2">
                <ClearableInputField
                  control={form.control}
                  name="confirmity_signature"
                  label="Conformity/ Signature"
                  isEditing={isEditing}
                />
                <ClearableInputField
                  control={form.control}
                  name="remarks"
                  label="Remarks"
                  isEditing={isEditing}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="card-content">
              <div className="space-y-4">
                <ClearableSelectField
                  control={form.control}
                  name="condition_type"
                  label="Housing Condition/ Types"
                  isEditing={isEditing}
                  options={[
                    "Needs minor repair",
                    "Needs major repair",
                    "Dilapidated/Condemned",
                    "Under renovation/Being repaired",
                    "Unfinished construction",
                    "Under construction",
                  ]}
                />

                <div className="flex gap-6">
                  <CheckboxField
                    control={form.control}
                    name="meralco"
                    label="Meralco"
                    isEditing={isEditing}
                  />
                  <CheckboxField
                    control={form.control}
                    name="maynilad"
                    label="Maynilad"
                    isEditing={isEditing}
                  />
                  <CheckboxField
                    control={form.control}
                    name="septic_tank"
                    label="Septic Tank"
                    isEditing={isEditing}
                  />
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <ClearableSelectField
                  control={form.control}
                  name="land_acquisition"
                  label="Land Acquisition"
                  isEditing={isEditing}
                  options={[
                    "CMP",
                    "Direct Buying",
                    "On Process",
                    "Auction",
                    "Organized Community",
                    "Expropriation",
                  ]}
                />

                <ClearableSelectField
                  control={form.control}
                  name="status_of_occupancy"
                  label="Status of Occupancy"
                  isEditing={isEditing}
                  options={["Owner", "Sharer", "Renter"]}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </Form>
    </div>
  );
};

export default HousingUtilities;
