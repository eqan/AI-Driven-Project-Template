"use client";

import { Table } from "@heroui/react";

import type { BackendDomain } from "@/types";

type BackendDomainTableProps = {
  domains: BackendDomain[];
};

export function BackendDomainTable({ domains }: BackendDomainTableProps) {
  return (
    <Table
      className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-[0_10px_28px_rgba(15,23,42,0.05)]"
      variant="secondary"
    >
      <Table.ScrollContainer className="w-full">
        <Table.Content
          aria-label="Backend domains ready for frontend integration"
        >
          <Table.Header>
            <Table.Column isRowHeader>Domain</Table.Column>
            <Table.Column>Route</Table.Column>
            <Table.Column>Frontend use</Table.Column>
          </Table.Header>
          <Table.Body renderEmptyState={() => "No backend domains mapped yet."}>
            {domains.map((domain) => (
              <Table.Row id={domain.title} key={domain.title}>
                <Table.Cell>{domain.title}</Table.Cell>
                <Table.Cell>{domain.route}</Table.Cell>
                <Table.Cell>{domain.description}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
