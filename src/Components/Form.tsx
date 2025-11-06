import React, { Children, isValidElement, useRef, ReactNode } from 'react';
import { View } from 'react-native';
import CustomButton from './CustomButton';

// Define the interface of the ref exposed by Input
export interface InputRef {
  setValidity: (valid: boolean) => void;
  getValue: () => string;
}

// Props for the Form component
export type FormProps = {
  children: ReactNode;
  onSubmit: (shouldSubmit: boolean) => void;
  onCancel: () => void;
};

export default function Form({ children, onSubmit, onCancel }: FormProps) {
  // Create refs for each child
  const childRefs = useRef<React.RefObject<InputRef>[]>([]);

  const childArray = Children.toArray(children);
  childRefs.current = childArray.map(
    (_, i) => childRefs.current[i] || React.createRef<InputRef>(),
  );

  // Validate all children
  const handleValidation = () => {
    let valid = true;

    childArray.forEach((child, index) => {
      if (isValidElement(child)) {
        const { value, validate } = child.props as {
          value?: string | number | null;
          validate?: boolean;
        };
        const ref = childRefs.current[index];

        if (validate) {
          let isEmpty = false;

          if (value === null || value === undefined) {
            isEmpty = true;
          } else if (typeof value === 'string' && value.trim().length === 0) {
            isEmpty = true;
          } else if (typeof value === 'number' && isNaN(value)) {
            isEmpty = true;
          }

          if (isEmpty) {
            valid = false;
            ref.current?.setValidity(false); // mark input as invalid
          }
        }
      }
    });

    return valid;
  };

  // Attach refs to children
  const enhancedChildren = childArray.map((child, i) =>
    isValidElement(child)
      ? React.cloneElement(child as React.ReactElement<any>, {
          ref: childRefs.current[i],
        })
      : child,
  );

  return (
    <View style={{ gap: 15 }}>
      {enhancedChildren}
      <CustomButton
        label="Submit"
        onPress={() => {
          const valid = handleValidation();
          onSubmit(valid);
        }}
      />
      <CustomButton label="Cancel" onPress={onCancel} />
    </View>
  );
}
